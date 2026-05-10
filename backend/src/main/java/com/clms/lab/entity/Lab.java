package com.clms.lab.entity;

import com.clms.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "labs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Lab extends BaseEntity {

    @Id
    @Column(updatable = false, nullable = false)
    private String id;

    @Column(nullable = false)
    private String name;

    private String roomNumber;

    private int maxRows;

    private int maxCols;

    @Column(nullable = false, unique = true)
    private String labApiKey;

    @OneToMany(mappedBy = "lab", fetch = FetchType.LAZY)
    @Builder.Default
    private Set<LabAssignment> assignments = new HashSet<>();
}