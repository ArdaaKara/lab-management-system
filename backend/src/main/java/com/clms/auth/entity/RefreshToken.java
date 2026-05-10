package com.clms.auth.entity;

import com.clms.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "refresh_tokens")
@Getter
@Setter
public class RefreshToken extends BaseEntity {

    @Id
    @Column(updatable = false, nullable = false)
    private String id;

    @Column(nullable = false, length = 64)
    private String tokenHash;

    @Column(nullable = false, length = 36)
    private String userId;

    @Column(nullable = false)
    private Instant expiresAt;

    @Column(nullable = false)
    private boolean revoked;

    public RefreshToken() {
        super();
        this.id = UUID.randomUUID().toString();
        this.revoked = false;
    }
}
