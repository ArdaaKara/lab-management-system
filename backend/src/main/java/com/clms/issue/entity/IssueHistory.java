package com.clms.issue.entity;

import com.clms.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "issue_history")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IssueHistory {

    @Id
    @Column(insertable = false, updatable = false, columnDefinition = "CHAR(36)")
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "issue_id")
    private Issue issue;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "changed_by_user_id")
    private User changedByUser;

    @Enumerated(EnumType.STRING)
    private IssueStatus oldStatus;

    @Enumerated(EnumType.STRING)
    private IssueStatus newStatus;

    private String note;

    @Builder.Default
    private Instant changedAt = Instant.now();
}
