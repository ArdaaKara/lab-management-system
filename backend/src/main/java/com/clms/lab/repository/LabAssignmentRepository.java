package com.clms.lab.repository;

import com.clms.lab.entity.LabAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface LabAssignmentRepository extends JpaRepository<LabAssignment, String> {

    Optional<LabAssignment> findByUserIdAndLabId(String userId, String labId);

    List<LabAssignment> findByLabId(String labId);

    List<LabAssignment> findByUserId(String userId);

    @Transactional
    void deleteByUserIdAndLabId(String userId, String labId);
}
