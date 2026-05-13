package com.deus.restaurant.service.impl;

import com.deus.restaurant.dto.request.AddItemsRequest;
import com.deus.restaurant.dto.request.OrderItemRequest;
import com.deus.restaurant.dto.request.OrderRequest;
import com.deus.restaurant.dto.request.StatusUpdateRequest;
import com.deus.restaurant.dto.response.KitchenOrderResponse;
import com.deus.restaurant.dto.response.OrderItemResponse;
import com.deus.restaurant.dto.response.OrderResponse;
import com.deus.restaurant.enums.OrderItemStatus;
import com.deus.restaurant.enums.OrderStatus;
import com.deus.restaurant.enums.StationType;
import com.deus.restaurant.exception.BadRequestException;
import com.deus.restaurant.exception.ResourceNotFoundException;
import com.deus.restaurant.mapper.OrderMapper;
import com.deus.restaurant.model.ItemCustomization;
import com.deus.restaurant.model.MenuItem;
import com.deus.restaurant.model.Order;
import com.deus.restaurant.model.OrderItem;
import com.deus.restaurant.model.RestaurantTable;
import com.deus.restaurant.model.TableSession;
import com.deus.restaurant.model.User;
import com.deus.restaurant.repository.MenuItemRepository;
import com.deus.restaurant.repository.OrderItemRepository;
import com.deus.restaurant.repository.OrderRepository;
import com.deus.restaurant.repository.RestaurantTableRepository;
import com.deus.restaurant.repository.TableSessionRepository;
import com.deus.restaurant.repository.UserRepository;
import com.deus.restaurant.service.OrderService;
import com.deus.restaurant.service.NotificationService;
import com.deus.restaurant.service.SectionAssignmentService;
import com.deus.restaurant.enums.NotificationType;
import com.deus.restaurant.enums.UserRole;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Comparator;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderServiceImpl implements OrderService {
    private static final BigDecimal TAX_RATE = new BigDecimal("0.18");
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final MenuItemRepository menuItemRepository;
    private final RestaurantTableRepository tableRepository;
    private final TableSessionRepository sessionRepository;
    private final UserRepository userRepository;
    private final OrderMapper orderMapper;
    private final NotificationService notificationService;
    private final SectionAssignmentService sectionAssignmentService;

    public OrderServiceImpl(OrderRepository orderRepository, OrderItemRepository orderItemRepository,
                            MenuItemRepository menuItemRepository, RestaurantTableRepository tableRepository,
                            TableSessionRepository sessionRepository, UserRepository userRepository, 
                            OrderMapper orderMapper, NotificationService notificationService,
                            SectionAssignmentService sectionAssignmentService) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.menuItemRepository = menuItemRepository;
        this.tableRepository = tableRepository;
        this.sessionRepository = sessionRepository;
        this.userRepository = userRepository;
        this.orderMapper = orderMapper;
        this.notificationService = notificationService;
        this.sectionAssignmentService = sectionAssignmentService;
    }

    @Override
    @Transactional
    public OrderResponse placeOrder(OrderRequest request) {
        RestaurantTable table = tableRepository.findById(request.getTableId())
                .orElseThrow(() -> new ResourceNotFoundException("Table not found"));
        TableSession session = sessionRepository.findBySessionToken(request.getSessionToken())
                .orElseThrow(() -> new ResourceNotFoundException("Session not found"));
        if (!Boolean.TRUE.equals(session.getIsActive())) throw new BadRequestException("Session is inactive");

        // Auto-assign Waiter based on section or workload
        User assignedWaiter = sectionAssignmentService.getAssignedWaiterForSection(table.getSection());
        if (assignedWaiter == null) {
            assignedWaiter = findBestWaiterForWorkload();
        }

        Order order = Order.builder()
                .table(table)
                .session(session)
                .customerSession(request.getSessionToken())
                .assignedWaiter(assignedWaiter)
                .sectionName(table.getSection())
                .orderStatus(OrderStatus.PLACED)
                .specialInstructions(request.getSpecialInstructions())
                .placedAt(LocalDateTime.now())
                .items(new ArrayList<>())
                .build();
        Order savedOrder = orderRepository.save(order);
        for (OrderItemRequest reqItem : request.getItems()) {
            addItemToOrder(savedOrder, reqItem);
        }
        recalcTotals(savedOrder);
        OrderResponse response = orderMapper.toResponse(orderRepository.save(savedOrder));
        
        // Notify the specific Waiter
        if (assignedWaiter != null) {
            String message = String.format("New Order #%d placed for Table %s in your section (%s)", 
                    savedOrder.getOrderId(), table.getTableNumber(), table.getSection());
            notificationService.sendNotification(assignedWaiter.getUserId(), NotificationType.NEW_ORDER, 
                    "New Table Order", message, "ORDER", savedOrder.getOrderId());
        }

        // Notify Kitchen/Bar staff generally if needed (broadcast)
        notificationService.sendOrderNotification(savedOrder.getOrderId(), NotificationType.NEW_ORDER);
        
        return response;
    }

    private User findBestWaiterForWorkload() {
        List<User> waiters = userRepository.findByRoleAndIsActive(UserRole.WAITER, true);
        if (waiters.isEmpty()) return null;
        
        return waiters.stream()
                .min(Comparator.comparingInt(waiter -> 
                    orderRepository.findByAssignedWaiterAndOrderStatusIn(waiter, 
                        List.of(OrderStatus.PLACED, OrderStatus.CONFIRMED, OrderStatus.PREPARING, OrderStatus.READY)
                    ).size()
                )).orElse(null);
    }

    private void notifyStaff(UserRole role, NotificationType type, String title, String message, String refType, Long refId) {
        userRepository.findByRoleAndIsActive(role, true).forEach(user -> 
            notificationService.sendNotification(user.getUserId(), type, title, message, refType, refId)
        );
    }

    private void addItemToOrder(Order order, OrderItemRequest reqItem) {
        MenuItem menuItem = menuItemRepository.findById(reqItem.getMenuItemId())
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found"));
                
        if (Boolean.TRUE.equals(menuItem.getTrackStock())) {
            if (menuItem.getStockQuantity() == null || menuItem.getStockQuantity() < reqItem.getQuantity()) {
                throw new BadRequestException("Not enough stock for item: " + menuItem.getItemName());
            }
            int newQuantity = menuItem.getStockQuantity() - reqItem.getQuantity();
            menuItem.setStockQuantity(newQuantity);
            
            // Auto-mark unavailable if stock hits 0
            if (newQuantity <= 0) {
                menuItem.setIsAvailable(false);
            }
            
            menuItemRepository.save(menuItem);

            // Low stock notification
            if (newQuantity <= (menuItem.getMinStockLevel() != null ? menuItem.getMinStockLevel() : 10)) {
                String title = "⚠️ Low Stock Alert";
                String message = String.format("%s is running low (%d remaining). Please restock!", 
                        menuItem.getItemName(), newQuantity);
                
                // Notify Manager and relevant station staff
                notifyStaff(UserRole.MANAGER, NotificationType.SYSTEM_ALERT, title, message, "ITEM", menuItem.getItemId());
                UserRole stationRole = menuItem.getDestinationStation() == StationType.BAR ? UserRole.BAR_STAFF : UserRole.KITCHEN_STAFF;
                notifyStaff(stationRole, NotificationType.SYSTEM_ALERT, title, message, "ITEM", menuItem.getItemId());
            }
        }

        BigDecimal unitPrice = menuItem.getDiscountedPrice() != null ? menuItem.getDiscountedPrice() : menuItem.getPrice();
        OrderItem item = OrderItem.builder()
                .order(order)
                .menuItem(menuItem)
                .quantity(reqItem.getQuantity())
                .unitPrice(unitPrice)
                .itemStatus(OrderItemStatus.PENDING)
                .specialNotes(reqItem.getSpecialNotes())
                .destinationStation(menuItem.getDestinationStation())
                .customizations(new ArrayList<>())
                .build();
        if (reqItem.getCustomizations() != null) {
            for (String c : reqItem.getCustomizations()) {
                item.getCustomizations().add(ItemCustomization.builder()
                        .orderItem(item)
                        .modificationName(c)
                        .additionalPrice(BigDecimal.ZERO)
                        .build());
            }
        }
        order.getItems().add(orderItemRepository.save(item));
    }

    private void recalcTotals(Order order) {
        BigDecimal subtotal = order.getItems().stream()
                .map(i -> i.getUnitPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal tax = subtotal.multiply(TAX_RATE).setScale(2, RoundingMode.HALF_UP);
        order.setSubtotal(subtotal.setScale(2, RoundingMode.HALF_UP));
        order.setTaxAmount(tax);
        order.setTotalAmount(order.getSubtotal().add(tax));
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponse getOrderById(Long id) {
        return orderMapper.toResponse(orderRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Order not found")));
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponse> getOrdersByTable(Long tableId) {
        RestaurantTable table = tableRepository.findById(tableId).orElseThrow(() -> new ResourceNotFoundException("Table not found"));
        return orderRepository.findByTableAndOrderStatusNot(table, OrderStatus.CANCELLED).stream().map(orderMapper::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponse> getOrdersByStatus(OrderStatus status) {
        return orderRepository.findByOrderStatus(status).stream().map(orderMapper::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<KitchenOrderResponse> getKitchenQueue() {
        return stationQueue(StationType.KITCHEN);
    }

    @Override
    @Transactional(readOnly = true)
    public List<KitchenOrderResponse> getBarQueue() {
        return stationQueue(StationType.BAR);
    }

    private List<KitchenOrderResponse> stationQueue(StationType station) {
        List<OrderItem> items = orderItemRepository.findByDestinationStationAndItemStatusIn(station, List.of(OrderItemStatus.PENDING, OrderItemStatus.PREPARING));
        
        Map<Long, List<OrderItem>> grouped = items.stream()
                .filter(i -> i.getOrder() != null)
                .collect(Collectors.groupingBy(i -> i.getOrder().getOrderId()));

        return grouped.entrySet().stream()
                .map(entry -> {
                    List<OrderItem> orderItems = entry.getValue();
                    Order o = orderItems.get(0).getOrder();
                    LocalDateTime startTime = o.getPlacedAt() != null ? o.getPlacedAt() : (o.getCreatedAt() != null ? o.getCreatedAt() : LocalDateTime.now());
                    Duration d = Duration.between(startTime, LocalDateTime.now());
                    long minutes = Math.max(0, d.toMinutes());
                    String age = minutes + " min";
                    
                    List<String> allergens = orderItems.stream()
                            .filter(i -> i.getMenuItem() != null && i.getMenuItem().getContainsAllergens() != null && !i.getMenuItem().getContainsAllergens().isBlank())
                            .map(i -> i.getMenuItem().getContainsAllergens())
                            .distinct()
                            .toList();
                    
                    return KitchenOrderResponse.builder()
                            .orderId(o.getOrderId())
                            .tableId(o.getTable() != null ? o.getTable().getTableId() : null)
                            .tableNumber(o.getTable() != null ? o.getTable().getTableNumber() : "N/A")
                            .items(orderItems.stream().map(orderMapper::toItemResponse).toList())
                            .timeSinceOrdered(age)
                            .allergenWarnings(allergens)
                            .build();
                })
                .sorted((a, b) -> a.getOrderId().compareTo(b.getOrderId()))
                .toList();
    }

    @Override
    @Transactional
    public OrderResponse updateOrderStatus(Long id, StatusUpdateRequest request) {
        Order order = orderRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        OrderStatus status = OrderStatus.valueOf(request.getStatus().trim().toUpperCase(Locale.ROOT));
        order.setOrderStatus(status);
        if (status == OrderStatus.COMPLETED) order.setCompletedAt(LocalDateTime.now());
        return orderMapper.toResponse(orderRepository.save(order));
    }

    @Override
    @Transactional
    public OrderItemResponse updateItemStatus(Long itemId, StatusUpdateRequest request) {
        OrderItem item = orderItemRepository.findById(itemId).orElseThrow(() -> new ResourceNotFoundException("Order item not found"));
        OrderItemStatus status = OrderItemStatus.valueOf(request.getStatus().trim().toUpperCase(Locale.ROOT));
        item.setItemStatus(status);
        
        if (status == OrderItemStatus.PREPARING && item.getPrepStartedAt() == null) item.setPrepStartedAt(LocalDateTime.now());
        
        Order order = item.getOrder();
        if (status == OrderItemStatus.READY) {
            item.setPrepCompletedAt(LocalDateTime.now());
            if (order.getAssignedWaiter() != null) {
                String itemName = item.getMenuItem() != null ? item.getMenuItem().getItemName() : "Item";
                String tableNum = order.getTable() != null ? order.getTable().getTableNumber() : "?";
                notificationService.sendNotification(
                    order.getAssignedWaiter().getUserId(),
                    NotificationType.ORDER_READY,
                    "✅ Item Ready",
                    itemName + " (x" + item.getQuantity() + ") is ready for Table " + tableNum + " - Order #" + order.getOrderId(),
                    "ORDER", order.getOrderId()
                );
            }
        }
        
        if (status == OrderItemStatus.SERVED) item.setServedAt(LocalDateTime.now());
        
        OrderItemResponse response = orderMapper.toItemResponse(orderItemRepository.save(item));
        
        // Auto-update Order Status based on all items
        updateParentOrderStatus(order);
        
        // Broadcast to orders topic for all dashboards
        notificationService.sendOrderNotification(order.getOrderId(), NotificationType.ORDER_READY);
        
        return response;
    }

    private void updateParentOrderStatus(Order order) {
        List<OrderItem> items = order.getItems();
        if (items.isEmpty()) return;

        boolean allServed = items.stream().allMatch(i -> i.getItemStatus() == OrderItemStatus.SERVED);
        boolean anyReady = items.stream().anyMatch(i -> i.getItemStatus() == OrderItemStatus.READY);
        boolean anyPreparing = items.stream().anyMatch(i -> i.getItemStatus() == OrderItemStatus.PREPARING);

        OrderStatus oldStatus = order.getOrderStatus();
        if (allServed) {
            order.setOrderStatus(OrderStatus.COMPLETED);
            if (order.getCompletedAt() == null) order.setCompletedAt(LocalDateTime.now());
        } else if (anyReady) {
            order.setOrderStatus(OrderStatus.READY);
        } else if (anyPreparing) {
            order.setOrderStatus(OrderStatus.PREPARING);
        }

        if (oldStatus != order.getOrderStatus()) {
            orderRepository.save(order);
        }
    }

    @Override
    @Transactional
    public OrderResponse addItemsToOrder(Long orderId, AddItemsRequest request) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        for (OrderItemRequest item : request.getItems()) addItemToOrder(order, item);
        recalcTotals(order);
        return orderMapper.toResponse(orderRepository.save(order));
    }

    @Override
    @Transactional
    public void cancelOrder(Long id) {
        Order order = orderRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        order.setOrderStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);
    }

    @Override
    @Transactional
    public OrderResponse assignWaiter(Long orderId, Long waiterId) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        User waiter = userRepository.findById(waiterId).orElseThrow(() -> new ResourceNotFoundException("Waiter not found"));
        order.setAssignedWaiter(waiter);
        return orderMapper.toResponse(orderRepository.save(order));
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponse> getWaiterOrders(Long waiterId) {
        User waiter = userRepository.findById(waiterId).orElseThrow(() -> new ResourceNotFoundException("Waiter not found"));
        return orderRepository.findByAssignedWaiterAndOrderStatusIn(waiter,
                List.of(OrderStatus.PLACED, OrderStatus.CONFIRMED, OrderStatus.PREPARING, OrderStatus.READY))
                .stream().map(orderMapper::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public com.deus.restaurant.dto.response.PaginatedResponse<OrderResponse> getAllOrders(int page, int size) {
        org.springframework.data.domain.Page<Order> orderPage = orderRepository.findAll(
                org.springframework.data.domain.PageRequest.of(page, size, org.springframework.data.domain.Sort.by("placedAt").descending())
        );
        
        return com.deus.restaurant.dto.response.PaginatedResponse.<OrderResponse>builder()
                .content(orderPage.getContent().stream().map(orderMapper::toResponse).toList())
                .totalElements(orderPage.getTotalElements())
                .totalPages(orderPage.getTotalPages())
                .currentPage(orderPage.getNumber())
                .pageSize(orderPage.getSize())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponse> getWaiterOrderHistory(Long waiterId) {
        User waiter = userRepository.findById(waiterId).orElseThrow(() -> new ResourceNotFoundException("Waiter not found"));
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        return orderRepository.findByAssignedWaiterAndPlacedAtAfter(waiter, startOfDay)
                .stream().map(orderMapper::toResponse).toList();
    }
}
