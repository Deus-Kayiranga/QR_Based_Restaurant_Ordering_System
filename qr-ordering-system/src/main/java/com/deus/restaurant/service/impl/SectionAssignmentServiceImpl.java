package com.deus.restaurant.service.impl;

import com.deus.restaurant.exception.ResourceNotFoundException;
import com.deus.restaurant.model.SectionAssignment;
import com.deus.restaurant.model.User;
import com.deus.restaurant.repository.SectionAssignmentRepository;
import com.deus.restaurant.repository.UserRepository;
import com.deus.restaurant.service.SectionAssignmentService;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SectionAssignmentServiceImpl implements SectionAssignmentService {

    private final SectionAssignmentRepository assignmentRepository;
    private final UserRepository userRepository;

    public SectionAssignmentServiceImpl(SectionAssignmentRepository assignmentRepository, UserRepository userRepository) {
        this.assignmentRepository = assignmentRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<SectionAssignment> getAllActiveAssignments() {
        return assignmentRepository.findByIsActiveTrue();
    }

    @Override
    @Transactional
    public SectionAssignment assignWaiterToSection(String sectionName, Long waiterId) {
        User waiter = userRepository.findById(waiterId)
                .orElseThrow(() -> new ResourceNotFoundException("Waiter not found"));

        // Deactivate existing active assignment for this section if any
        assignmentRepository.findBySectionNameAndIsActiveTrue(sectionName)
                .ifPresent(a -> {
                    a.setIsActive(false);
                    assignmentRepository.save(a);
                });

        SectionAssignment assignment = SectionAssignment.builder()
                .sectionName(sectionName)
                .waiter(waiter)
                .isActive(true)
                .build();
        return assignmentRepository.save(assignment);
    }

    @Override
    @Transactional
    public void removeAssignment(Long assignmentId) {
        SectionAssignment a = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found"));
        a.setIsActive(false);
        assignmentRepository.save(a);
    }

    @Override
    @Transactional(readOnly = true)
    public User getAssignedWaiterForSection(String sectionName) {
        if (sectionName == null || sectionName.isBlank()) return null;
        return assignmentRepository.findBySectionNameAndIsActiveTrue(sectionName)
                .map(SectionAssignment::getWaiter)
                .orElse(null);
    }
}
