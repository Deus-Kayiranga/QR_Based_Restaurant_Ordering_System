package com.deus.restaurant.controller;

import com.deus.restaurant.dto.request.CategoryRequest;
import com.deus.restaurant.dto.request.MenuItemRequest;
import com.deus.restaurant.dto.response.ApiResponse;
import com.deus.restaurant.dto.response.MenuCategoryResponse;
import com.deus.restaurant.dto.response.MenuItemResponse;
import com.deus.restaurant.enums.StationType;
import com.deus.restaurant.service.MenuService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/menu")
public class MenuController {
    private final MenuService menuService;
    public MenuController(MenuService menuService) { this.menuService = menuService; }

    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<MenuCategoryResponse>>> categories() {
        return ResponseEntity.ok(ApiResponse.ok("Categories", menuService.getAllCategories()));
    }
    @PostMapping("/categories") @PreAuthorize("hasAnyRole('MANAGER','SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<MenuCategoryResponse>> createCategory(@Valid @RequestBody CategoryRequest req) {
        return ResponseEntity.ok(ApiResponse.ok("Category created", menuService.createCategory(req)));
    }
    @PutMapping("/categories/{id}") @PreAuthorize("hasAnyRole('MANAGER','SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<MenuCategoryResponse>> updateCategory(@PathVariable Long id, @Valid @RequestBody CategoryRequest req) {
        return ResponseEntity.ok(ApiResponse.ok("Category updated", menuService.updateCategory(id, req)));
    }
    @DeleteMapping("/categories/{id}") @PreAuthorize("hasAnyRole('MANAGER','SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable Long id) { menuService.deleteCategory(id); return ResponseEntity.ok(ApiResponse.ok("Category deleted", null)); }

    @GetMapping("/items")
    public ResponseEntity<ApiResponse<List<MenuItemResponse>>> items(@RequestParam(required = false) Long categoryId,
                                                                     @RequestParam(required = false) String search,
                                                                     @RequestParam(required = false) StationType station) {
        List<MenuItemResponse> data = categoryId != null ? menuService.getItemsByCategory(categoryId)
                : (search != null && !search.isBlank()) ? menuService.searchItems(search)
                : station == StationType.KITCHEN ? menuService.getKitchenItems()
                : station == StationType.BAR ? menuService.getBarItems()
                : menuService.getAllAvailableItems();
        return ResponseEntity.ok(ApiResponse.ok("Items", data));
    }
    @GetMapping("/items/available")
    public ResponseEntity<ApiResponse<List<MenuItemResponse>>> available() {
        return ResponseEntity.ok(ApiResponse.ok("Available items", menuService.getAllAvailableItems()));
    }
    @GetMapping("/items/{id}") public ResponseEntity<ApiResponse<MenuItemResponse>> item(@PathVariable Long id) { return ResponseEntity.ok(ApiResponse.ok("Item", menuService.getItemById(id))); }
    @PostMapping("/items") @PreAuthorize("hasAnyRole('MANAGER','SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<MenuItemResponse>> createItem(@Valid @RequestBody MenuItemRequest req) { return ResponseEntity.ok(ApiResponse.ok("Item created", menuService.createItem(req))); }
    @PutMapping("/items/{id}") @PreAuthorize("hasAnyRole('MANAGER','SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<MenuItemResponse>> updateItem(@PathVariable Long id, @Valid @RequestBody MenuItemRequest req) { return ResponseEntity.ok(ApiResponse.ok("Item updated", menuService.updateItem(id, req))); }
    @PatchMapping("/items/{id}/availability") @PreAuthorize("hasAnyRole('MANAGER','SUPER_ADMIN','KITCHEN_STAFF','BAR_STAFF')")
    public ResponseEntity<ApiResponse<MenuItemResponse>> toggle(@PathVariable Long id) { return ResponseEntity.ok(ApiResponse.ok("Availability toggled", menuService.toggleAvailability(id))); }
    @GetMapping("/items/low-stock")
    @PreAuthorize("hasAnyRole('MANAGER','SUPER_ADMIN','KITCHEN_STAFF','BAR_STAFF')")
    public ResponseEntity<ApiResponse<List<MenuItemResponse>>> lowStock() {
        return ResponseEntity.ok(ApiResponse.ok("Low stock items", menuService.getLowStockItems()));
    }

    @PostMapping("/items/{id}/stock")
    @PreAuthorize("hasAnyRole('MANAGER','SUPER_ADMIN','KITCHEN_STAFF','BAR_STAFF')")
    public ResponseEntity<ApiResponse<MenuItemResponse>> updateStock(@PathVariable Long id, @RequestBody java.util.Map<String, Integer> payload) {
        return ResponseEntity.ok(ApiResponse.ok("Stock updated", menuService.updateStock(id, payload.get("quantity"))));
    }
}

