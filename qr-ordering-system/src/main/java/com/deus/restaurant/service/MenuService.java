package com.deus.restaurant.service;

import com.deus.restaurant.dto.request.CategoryRequest;
import com.deus.restaurant.dto.request.MenuItemRequest;
import com.deus.restaurant.dto.response.MenuCategoryResponse;
import com.deus.restaurant.dto.response.MenuItemResponse;
import java.util.List;

public interface MenuService {
    List<MenuCategoryResponse> getAllCategories();

    MenuCategoryResponse createCategory(CategoryRequest request);

    MenuCategoryResponse updateCategory(Long id, CategoryRequest request);

    void deleteCategory(Long id);

    List<MenuItemResponse> getItemsByCategory(Long categoryId);

    List<MenuItemResponse> getAllAvailableItems();

    MenuItemResponse getItemById(Long id);

    MenuItemResponse createItem(MenuItemRequest request);

    MenuItemResponse updateItem(Long id, MenuItemRequest request);

    MenuItemResponse toggleAvailability(Long id);

    List<MenuItemResponse> searchItems(String query);

    List<MenuItemResponse> getKitchenItems();

    List<MenuItemResponse> getBarItems();

    List<MenuItemResponse> getLowStockItems();

    MenuItemResponse updateStock(Long id, Integer quantity);
}
