package com.clms.computer.entity;

import com.clms.lab.entity.Lab;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;

@Entity
@Table(name = "computers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class Computer {

    @Id
    @Column(insertable = false, updatable = false)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lab_id")
    private Lab lab;

    private String assetTag;
    private String hostname;
    private String macAddress;
    private String ipAddress;
    
    private Integer gridRow;
    private Integer gridCol;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ComputerStatus status = ComputerStatus.ACTIVE;

    @Column(columnDefinition = "json")
    @JdbcTypeCode(SqlTypes.JSON)
    private HardwareSpecs hardwareSpecs;

    @Builder.Default
    private boolean isActive = true;

    private Instant lastSeenAt;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;
}
