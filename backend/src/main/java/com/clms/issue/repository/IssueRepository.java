package com.clms.issue.repository;

import com.clms.issue.entity.Issue;
import com.clms.issue.entity.IssueStatus;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface IssueRepository extends JpaRepository<Issue, String> {

    @Query("SELECT i FROM Issue i JOIN FETCH i.computer c WHERE c.id = :computerId")
    List<Issue> findByComputerId(@Param("computerId") String computerId);

    List<Issue> findByComputerLabIdAndStatus(String labId, IssueStatus status);

    List<Issue> findByAssignedTechnicianId(String assignedTechnicianId);

    long countByComputerIdAndStatusNot(String computerId, IssueStatus status);

    List<Issue> findByStatus(IssueStatus status);

    @Query("SELECT i.computer.id, i.computer.hostname, i.computer.assetTag, COUNT(i) " +
           "FROM Issue i " +
           "WHERE i.computer.lab.id = :labId AND i.computer.isActive = true " +
           "GROUP BY i.computer.id, i.computer.hostname, i.computer.assetTag " +
           "ORDER BY COUNT(i) DESC")
    List<Object[]> findTopFaultyComputersByLabId(@Param("labId") String labId, Pageable pageable);
}
