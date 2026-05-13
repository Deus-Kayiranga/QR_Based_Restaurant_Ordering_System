package com.deus.restaurant.service.impl;

import com.deus.restaurant.dto.request.CategoryRequest;
import com.deus.restaurant.dto.request.MenuItemRequest;
import com.deus.restaurant.dto.response.MenuCategoryResponse;
import com.deus.restaurant.dto.response.MenuItemResponse;
import com.deus.restaurant.enums.StationType;
import com.deus.restaurant.exception.ResourceNotFoundException;
import com.deus.restaurant.mapper.MenuCategoryMapper;
import com.deus.restaurant.mapper.MenuItemMapper;
import com.deus.restaurant.model.MenuCategory;
import com.deus.restaurant.model.MenuItem;
import com.deus.restaurant.repository.MenuCategoryRepository;
import com.deus.restaurant.repository.MenuItemRepository;
import com.deus.restaurant.service.MenuService;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MenuServiceImpl implements MenuService {

    private final MenuCategoryRepository categoryRepository;
    private final MenuItemRepository itemRepository;
    private final MenuCategoryMapper categoryMapper;
    private final MenuItemMapper itemMapper;
    private final com.deus.restaurant.service.NotificationService notificationService;

    public MenuServiceImpl(MenuCategoryRepository categoryRepository, MenuItemRepository itemRepository,
                           MenuCategoryMapper categoryMapper, MenuItemMapper itemMapper,
                           com.deus.restaurant.service.NotificationService notificationService) {
        this.categoryRepository = categoryRepository;
        this.itemRepository = itemRepository;
        this.categoryMapper = categoryMapper;
        this.itemMapper = itemMapper;
        this.notificationService = notificationService;
    }

    @Override
    @Transactional(readOnly = true)
    public List<MenuCategoryResponse> getAllCategories() {
        return categoryRepository.findByIsActiveTrueOrderByDisplayOrder().stream().map(categoryMapper::toResponse).toList();
    }

    @Override
    @Transactional
    public MenuCategoryResponse createCategory(CategoryRequest request) {
        MenuCategory c = MenuCategory.builder()
                .categoryName(request.getCategoryName().trim())
                .description(request.getDescription())
                .displayOrder(request.getDisplayOrder())
                .isActive(true)
                .build();
        return categoryMapper.toResponse(categoryRepository.save(c));
    }

    @Override
    @Transactional
    public MenuCategoryResponse updateCategory(Long id, CategoryRequest request) {
        MenuCategory c = categoryRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        c.setCategoryName(request.getCategoryName().trim());
        c.setDescription(request.getDescription());
        c.setDisplayOrder(request.getDisplayOrder());
        return categoryMapper.toResponse(categoryRepository.save(c));
    }

    @Override
    @Transactional
    public void deleteCategory(Long id) {
        MenuCategory c = categoryRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        c.setIsActive(false);
        categoryRepository.save(c);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MenuItemResponse> getItemsByCategory(Long categoryId) {
        MenuCategory category = categoryRepository.findById(categoryId).orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        return itemRepository.findByCategoryAndIsAvailableTrue(category).stream().map(itemMapper::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<MenuItemResponse> getAllAvailableItems() {
        return itemRepository.findAll().stream().filter(i -> Boolean.TRUE.equals(i.getIsAvailable())).map(itemMapper::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public MenuItemResponse getItemById(Long id) {
        return itemMapper.toResponse(itemRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Menu item not found")));
    }

    @Override
    @Transactional
    public MenuItemResponse createItem(MenuItemRequest request) {
        MenuCategory category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        MenuItem item = MenuItem.builder()
                .category(category)
                .itemName(request.getItemName().trim())
                .description(request.getDescription())
                .price(request.getPrice())
                .imageUrl(request.getImageUrl())
                .destinationStation(request.getDestinationStation())
                .isVegetarian(Boolean.TRUE.equals(request.getIsVegetarian()))
                .isVegan(Boolean.TRUE.equals(request.getIsVegan()))
                .isGlutenFree(Boolean.TRUE.equals(request.getIsGlutenFree()))
                .containsAllergens(request.getContainsAllergens())
                .displayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : 0)
                .trackStock(Boolean.TRUE.equals(request.getTrackStock()))
                .stockQuantity(request.getStockQuantity() != null ? request.getStockQuantity() : 0)
                .isAvailable(true)
                .build();
        MenuItem saved = itemRepository.save(item);
        notificationService.sendMenuUpdate("New Item", saved.getItemName() + " has been added.");
        return itemMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public MenuItemResponse updateItem(Long id, MenuItemRequest request) {
        MenuItem item = itemRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Menu item not found"));
        MenuCategory category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        item.setCategory(category);
        item.setItemName(request.getItemName().trim());
        item.setDescription(request.getDescription());
        item.setPrice(request.getPrice());
        item.setImageUrl(request.getImageUrl());
        item.setDestinationStation(request.getDestinationStation());
        item.setIsVegetarian(Boolean.TRUE.equals(request.getIsVegetarian()));
        item.setIsVegan(Boolean.TRUE.equals(request.getIsVegan()));
        item.setIsGlutenFree(Boolean.TRUE.equals(request.getIsGlutenFree()));
        item.setContainsAllergens(request.getContainsAllergens());
        item.setDisplayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : item.getDisplayOrder());
        item.setTrackStock(Boolean.TRUE.equals(request.getTrackStock()));
        item.setStockQuantity(request.getStockQuantity() != null ? request.getStockQuantity() : item.getStockQuantity());
        item.setMinStockLevel(request.getMinStockLevel() != null ? request.getMinStockLevel() : item.getMinStockLevel());
        MenuItem saved = itemRepository.save(item);
        notificationService.sendMenuUpdate("Item Updated", saved.getItemName() + " has been updated.");
        return itemMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public MenuItemResponse toggleAvailability(Long id) {
        MenuItem item = itemRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Menu item not found"));
        item.setIsAvailable(!Boolean.TRUE.equals(item.getIsAvailable()));
        MenuItem saved = itemRepository.save(item);
        String status = Boolean.TRUE.equals(saved.getIsAvailable()) ? "available" : "unavailable";
        notificationService.sendMenuUpdate("Availability Changed", saved.getItemName() + " is now " + status);
        return itemMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MenuItemResponse> searchItems(String query) {
        return itemRepository.findByItemNameContainingIgnoreCaseAndIsAvailableTrue(query).stream().map(itemMapper::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<MenuItemResponse> getKitchenItems() {
        return itemRepository.findByDestinationStationAndIsAvailableTrue(StationType.KITCHEN).stream().map(itemMapper::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<MenuItemResponse> getBarItems() {
        return itemRepository.findByDestinationStationAndIsAvailableTrue(StationType.BAR).stream().map(itemMapper::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<MenuItemResponse> getLowStockItems() {
        return itemRepository.findAll().stream()
                .filter(i -> Boolean.TRUE.equals(i.getTrackStock()) && 
                        i.getStockQuantity() <= (i.getMinStockLevel() != null ? i.getMinStockLevel() : 10))
                .map(itemMapper::toResponse).toList();
    }

    @Override
    @Transactional
    public MenuItemResponse updateStock(Long id, Integer quantity) {
        MenuItem item = itemRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Item not found"));
        item.setStockQuantity(quantity);
        item.setTrackStock(true);
        MenuItem saved = itemRepository.save(item);
        notificationService.sendMenuUpdate("Stock Updated", saved.getItemName() + " stock set to " + saved.getStockQuantity());
        return itemMapper.toResponse(saved);
    }
}

