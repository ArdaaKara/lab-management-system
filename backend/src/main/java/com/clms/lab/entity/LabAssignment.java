package com.clms.lab.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;

@Entity
@Table(name = "lab_assignments", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "lab_id"})
})
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LabAssignment {

    @Id
    @Column(insertable = false, updatable = false, columnDefinition = "CHAR(36)")
    private String id;

    @Column(name = "user_id", nullable = false, columnDefinition = "CHAR(36)")
    private String userId;

    @Column(name = "lab_id", nullable = false, columnDefinition = "CHAR(36)")
    private String labId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "lab_id", insertable = false, updatable = false)
    private Lab lab;

    @CreatedDate
    @Column(name = "assigned_at", updatable = false)
    private Instant assignedAt;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof LabAssignment that)) return false;
        return id != null && id.equals(that.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
