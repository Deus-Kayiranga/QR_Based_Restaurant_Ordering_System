package com.deus.restaurant.config;

import com.deus.restaurant.enums.StationType;
import com.deus.restaurant.enums.TableStatus;
import com.deus.restaurant.enums.UserRole;
import com.deus.restaurant.model.MenuCategory;
import com.deus.restaurant.model.MenuItem;
import com.deus.restaurant.model.RestaurantTable;
import com.deus.restaurant.model.User;
import com.deus.restaurant.repository.MenuCategoryRepository;
import com.deus.restaurant.repository.MenuItemRepository;
import com.deus.restaurant.repository.RestaurantTableRepository;
import com.deus.restaurant.repository.TableSessionRepository;
import com.deus.restaurant.repository.UserRepository;
import com.deus.restaurant.repository.AuditLogRepository;
import com.deus.restaurant.service.QRCodeService;
import com.deus.restaurant.model.AuditLog;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class DataInitializer implements CommandLineRunner {
    private final UserRepository userRepository;
    private final RestaurantTableRepository tableRepository;
    private final TableSessionRepository sessionRepository;
    private final MenuCategoryRepository categoryRepository;
    private final MenuItemRepository itemRepository;
    private final PasswordEncoder passwordEncoder;
    private final QRCodeService qrCodeService;
    private final AuditLogRepository auditLogRepository;

    public DataInitializer(UserRepository userRepository, RestaurantTableRepository tableRepository, 
                           TableSessionRepository sessionRepository, MenuCategoryRepository categoryRepository,
                           MenuItemRepository itemRepository, PasswordEncoder passwordEncoder, 
                           QRCodeService qrCodeService, AuditLogRepository auditLogRepository) {
        this.userRepository = userRepository;
        this.tableRepository = tableRepository;
        this.sessionRepository = sessionRepository;
        this.categoryRepository = categoryRepository;
        this.itemRepository = itemRepository;
        this.passwordEncoder = passwordEncoder;
        this.qrCodeService = qrCodeService;
        this.auditLogRepository = auditLogRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        seedUsers();
        seedTables();
        seedMenu();
        seedAuditLogs();
    }

    private void seedUsers() {
        createUserIfMissing("admin@deusrestaurant.rw", "System", "Admin", UserRole.SUPER_ADMIN, "admin123");
        createUserIfMissing("manager@deusrestaurant.rw", "Floor", "Manager", UserRole.MANAGER, "password123");
        createUserIfMissing("cashier@deusrestaurant.rw", "Main", "Cashier", UserRole.CASHIER, "password123");
        createUserIfMissing("kitchen@deusrestaurant.rw", "Kitchen", "Staff", UserRole.KITCHEN_STAFF, "password123");
        createUserIfMissing("bar@deusrestaurant.rw", "Bar", "Staff", UserRole.BAR_STAFF, "password123");
        createUserIfMissing("waiter@deusrestaurant.rw", "Service", "Waiter", UserRole.WAITER, "password123");
    }

    private void createUserIfMissing(String email, String firstName, String lastName, UserRole role, String rawPassword) {
        userRepository.findByEmail(email).orElseGet(() -> userRepository.save(User.builder()
                .firstName(firstName)
                .lastName(lastName)
                .email(email)
                .role(role)
                .passwordHash(passwordEncoder.encode(rawPassword))
                .isActive(true)
                .build()));
    }

    private void seedTables() {
        for (String num : List.of("A1","A2","A3","A4","B1","B2","B3","B4","C1","C2","C3")) {
            tableRepository.findByTableNumber(num).orElseGet(() -> {
                String token = qrCodeService.generateQRToken();
                return tableRepository.save(RestaurantTable.builder()
                        .tableNumber(num)
                        .seatingCapacity(4)
                        .section(num.substring(0,1))
                        .status(TableStatus.AVAILABLE)
                        .qrCodeToken(token)
                        .qrCodeImageUrl(qrCodeService.generateQRImageUrl(num, token))
                        .isActive(true)
                        .build());
            });
        }
        
        // Seed demo session for frontend testing
        tableRepository.findByTableNumber("A1").ifPresent(table -> {
            com.deus.restaurant.model.TableSession session = com.deus.restaurant.model.TableSession.builder()
                    .table(table)
                    .sessionToken("demo-session-token")
                    .startedAt(java.time.LocalDateTime.now())
                    .customerCount(1)
                    .isActive(true)
                    .build();
            sessionRepository.findBySessionToken("demo-session-token").orElseGet(() -> sessionRepository.save(session));
        });
    }

    private void seedMenu() {
        MenuCategory croissant = createCategory("Croissant", 1);
        MenuCategory waffle = createCategory("Waffle", 2);
        MenuCategory coffee = createCategory("Coffee", 3);
        createCategory("Ice Cream", 4);
        MenuCategory drinks = createCategory("Drinks", 5);
        MenuCategory alcohol = createCategory("Alcohol", 6);

        createItem("Almond Brown Sugar Croissant", "Buttery croissant with almond cream and brown sugar", "12980", StationType.KITCHEN, croissant, false, 0);
        createItem("Smoke Tenderloin Croissant", "Savory croissant with smoked tenderloin", "10010", StationType.KITCHEN, croissant, false, 0);
        createItem("Berry Whipped Cream Croissant", "Fresh berry topping and whipped cream", "8980", StationType.KITCHEN, croissant, false, 0);
        createItem("Belgian Waffle", "Classic golden waffle served warm", "8500", StationType.KITCHEN, waffle, false, 0);
        
        // Bar Items with Stock Tracking
        createItem("Rwandan Single Origin Coffee", "Freshly brewed specialty coffee", "3500", StationType.BAR, coffee, true, 50);
        createItem("Iced Latte", "Espresso with chilled milk and ice", "4200", StationType.BAR, coffee, true, 40);
        createItem("Cappuccino", "Rich espresso with steamed milk foam", "3800", StationType.BAR, coffee, true, 35);
        
        createItem("Fresh Mango Juice", "Cold pressed mango juice", "2800", StationType.BAR, drinks, true, 20);
        createItem("Passion Fruit Juice", "Natural passion fruit juice", "3000", StationType.BAR, drinks, true, 15);
        createItem("Virgin Mojito", "Refreshing mint and lime mocktail", "5500", StationType.BAR, drinks, true, 10);
        
        createItem("Heineken Beer", "Premium lager beer", "4500", StationType.BAR, alcohol, true, 24);
        createItem("Skol Malt", "Local favorite malt beer", "3500", StationType.BAR, alcohol, true, 12);
        createItem("Whiskey Sour", "Classic cocktail with lemon and egg white", "9500", StationType.BAR, alcohol, true, 8);
        createItem("Old Fashioned", "Bourbon, sugar, and bitters", "10500", StationType.BAR, alcohol, true, 5);
    }

    private MenuCategory createCategory(String name, int order) {
        return categoryRepository.findAll().stream().filter(c -> name.equalsIgnoreCase(c.getCategoryName())).findFirst()
                .orElseGet(() -> categoryRepository.save(MenuCategory.builder()
                        .categoryName(name)
                        .description(name + " menu")
                        .displayOrder(order)
                        .isActive(true)
                        .build()));
    }

    private void createItem(String name, String desc, String price, StationType station, MenuCategory category, boolean trackStock, int stock) {
        boolean exists = itemRepository.findAll().stream().anyMatch(i -> name.equalsIgnoreCase(i.getItemName()));
        if (!exists) {
            itemRepository.save(MenuItem.builder()
                    .category(category)
                    .itemName(name)
                    .description(desc)
                    .price(new BigDecimal(price))
                    .destinationStation(station)
                    .isAvailable(true)
                    .isVegetarian(false)
                    .isVegan(false)
                    .isGlutenFree(false)
                    .displayOrder(0)
                    .trackStock(trackStock)
                    .stockQuantity(stock)
                    .minStockLevel(10)
                    .build());
        }
    }

    private void seedAuditLogs() {
        if (auditLogRepository.count() == 0) {
            auditLogRepository.save(AuditLog.builder().action("SYSTEM_INIT").module("SYSTEM").details("System initialization and database seeding completed.").performedBy("System").userRole("SYSTEM").build());
            auditLogRepository.save(AuditLog.builder().action("LOGIN").module("AUTH").details("Admin user logged in successfully.").performedBy("admin@deusrestaurant.rw").userRole("SUPER_ADMIN").build());
            auditLogRepository.save(AuditLog.builder().action("UPDATE_STOCK").module("MENU").details("Restocked Skol Malt (+5 units)").performedBy("manager@deusrestaurant.rw").userRole("MANAGER").build());
            auditLogRepository.save(AuditLog.builder().action("PLACE_ORDER").module("ORDERS").details("New order placed for Table A1 (Order #1)").performedBy("waiter@deusrestaurant.rw").userRole("WAITER").build());
        }
    }
}

