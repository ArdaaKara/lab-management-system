package com.clms.auth.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "refresh_tokens")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
public class RefreshToken {

    @Id
    @Column(updatable = false, nullable = false, columnDefinition = "CHAR(36)")
    private String id;

    @Column(nullable = false, length = 64)
    private String tokenHash;

    @Column(nullable = false, columnDefinition = "CHAR(36)")
    private String userId;

    @Column(nullable = false)
    private Instant expiresAt;

    @Column(nullable = false)
    private boolean revoked;

    @CreatedDate
    @Column(updatable = false)
    private Instant createdAt;

    public RefreshToken() {
        this.id = UUID.randomUUID().toString();
        this.revoked = false;
    }
}
