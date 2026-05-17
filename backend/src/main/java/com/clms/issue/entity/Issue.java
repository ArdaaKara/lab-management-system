package com.clms.issue.entity;

import com.clms.computer.entity.Computer;
import com.clms.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;

@Entity
@Table(name = "issues")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class Issue {

    @Id
    @Column(insertable = false, updatable = false, columnDefinition = "CHAR(36)")
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "computer_id")
    private Computer computer;

    @Enumerated(EnumType.STRING)
    private IssueCategory category;

    private String description;

    private String studentIdReporter;
    private String reporterIp;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private IssueStatus status = IssueStatus.OPEN;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_technician_id")
    private User assignedTechnician;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;
}
