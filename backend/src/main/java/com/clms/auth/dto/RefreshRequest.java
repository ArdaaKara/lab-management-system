package com.clms.auth.dto;

import jakarta.validation.constraints.NotBlank;

public record RefreshRequest(
    @NotBlank(message = "Refresh token boş bırakılamaz")
    String refreshToken
) {}
