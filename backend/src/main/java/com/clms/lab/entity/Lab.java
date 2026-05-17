package com.clms.lab.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "labs")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Lab {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false, nullable = false, columnDefinition = "CHAR(36)")
    private String id;

    @Column(nullable = false)
    private String name;

    private String roomNumber;

    @Column(columnDefinition = "TINYINT", nullable = false)
    private int maxRows;

    @Column(columnDefinition = "TINYINT", nullable = false)
    private int maxCols;

    @Column(nullable = false, unique = true)
    private String labApiKey;

    @OneToMany(mappedBy = "lab", fetch = FetchType.LAZY)
    @Builder.Default
    private Set<LabAssignment> assignments = new HashSet<>();

    @CreatedDate
    @Column(updatable = false)
    private Instant createdAt;
}
