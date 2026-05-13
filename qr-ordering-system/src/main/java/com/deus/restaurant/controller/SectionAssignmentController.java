package com.deus.restaurant.controller;

import com.deus.restaurant.dto.response.ApiResponse;
import com.deus.restaurant.model.SectionAssignment;
import com.deus.restaurant.service.SectionAssignmentService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sections")
public class SectionAssignmentController {

    private final SectionAssignmentService assignmentService;

    public SectionAssignmentController(SectionAssignmentService assignmentService) {
        this.assignmentService = assignmentService;
    }

    @GetMapping("/")
    public ResponseEntity<ApiResponse<List<SectionAssignment>>> getAll() {
        return ResponseEntity.ok(ApiResponse.ok("Active assignments", assignmentService.getAllActiveAssignments()));
    }

    @PostMapping("/assign")
    @PreAuthorize("hasRole('MANAGER') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<SectionAssignment>> assign(@RequestParam String sectionName, @RequestParam Long waiterId) {
        return ResponseEntity.ok(ApiResponse.ok("Waiter assigned to section", assignmentService.assignWaiterToSection(sectionName, waiterId)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('MANAGER') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> remove(@PathVariable Long id) {
        assignmentService.removeAssignment(id);
        return ResponseEntity.ok(ApiResponse.ok("Assignment removed", null));
    }
}
