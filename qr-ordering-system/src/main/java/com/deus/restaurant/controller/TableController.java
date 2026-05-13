package com.deus.restaurant.controller;

import com.deus.restaurant.dto.request.StatusUpdateRequest;
import com.deus.restaurant.dto.request.TableRequest;
import com.deus.restaurant.dto.response.ApiResponse;
import com.deus.restaurant.dto.response.TableResponse;
import com.deus.restaurant.enums.TableStatus;
import com.deus.restaurant.service.TableService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tables")
public class TableController {
    private final TableService tableService;
    public TableController(TableService tableService) { this.tableService = tableService; }

    @GetMapping @PreAuthorize("hasAnyRole('MANAGER','SUPER_ADMIN','WAITER')")
    public ResponseEntity<ApiResponse<List<TableResponse>>> all() { return ResponseEntity.ok(ApiResponse.ok("Tables", tableService.getAllTables())); }
    
    @GetMapping("/{id}") public ResponseEntity<ApiResponse<TableResponse>> byId(@PathVariable Long id) { return ResponseEntity.ok(ApiResponse.ok("Table", tableService.getTableById(id))); }
    
    @PostMapping @PreAuthorize("hasAnyRole('SUPER_ADMIN','MANAGER')")
    public ResponseEntity<ApiResponse<TableResponse>> create(@Valid @RequestBody TableRequest req) { return ResponseEntity.ok(ApiResponse.ok("Table created", tableService.createTable(req))); }
    
    @PutMapping("/{id}") @PreAuthorize("hasAnyRole('SUPER_ADMIN','MANAGER')")
    public ResponseEntity<ApiResponse<TableResponse>> update(@PathVariable Long id, @Valid @RequestBody TableRequest req) { return ResponseEntity.ok(ApiResponse.ok("Table updated", tableService.updateTable(id, req))); }
    @DeleteMapping("/{id}") @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) { tableService.deleteTable(id); return ResponseEntity.ok(ApiResponse.ok("Table deleted", null)); }
    @PatchMapping("/{id}/status") @PreAuthorize("hasAnyRole('MANAGER','SUPER_ADMIN','WAITER')")
    public ResponseEntity<ApiResponse<Void>> status(@PathVariable Long id, @Valid @RequestBody StatusUpdateRequest req) {
        tableService.updateTableStatus(id, TableStatus.valueOf(req.getStatus().trim().toUpperCase()));
        return ResponseEntity.ok(ApiResponse.ok("Status updated", null));
    }
    @PostMapping("/{id}/generate-qr") @PreAuthorize("hasAnyRole('SUPER_ADMIN','MANAGER')")
    public ResponseEntity<ApiResponse<String>> qr(@PathVariable Long id) { return ResponseEntity.ok(ApiResponse.ok("QR generated", tableService.generateQRCode(id))); }
}

