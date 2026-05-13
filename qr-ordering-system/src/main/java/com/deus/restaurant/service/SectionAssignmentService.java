package com.deus.restaurant.service;

import com.deus.restaurant.model.SectionAssignment;
import com.deus.restaurant.model.User;
import java.util.List;

public interface SectionAssignmentService {
    List<SectionAssignment> getAllActiveAssignments();
    SectionAssignment assignWaiterToSection(String sectionName, Long waiterId);
    void removeAssignment(Long assignmentId);
    User getAssignedWaiterForSection(String sectionName);
}
