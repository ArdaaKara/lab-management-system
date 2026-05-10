package com.clms.lab.repository;

import com.clms.lab.entity.Lab;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface LabRepository extends JpaRepository<Lab, String> {
    Optional<Lab> findByLabApiKey(String apiKey);

    @Query("SELECT DISTINCT l FROM Lab l LEFT JOIN FETCH l.assignments")
    List<Lab> findAllWithAssignments();

    @Query("SELECT l FROM Lab l LEFT JOIN FETCH l.assignments WHERE l.id = :id")
    Optional<Lab> findByIdWithAssignments(@Param("id") String id);
}
