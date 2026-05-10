package com.clms.user.dto;

import java.time.Instant;
import java.util.List;

public record UserResponse(
        String id,
        String fullName,
        String email,
        boolean isActive,
        List<String> roles,
        Instant createdAt
) {
}
