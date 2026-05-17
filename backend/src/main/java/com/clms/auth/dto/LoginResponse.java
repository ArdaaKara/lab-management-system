package com.clms.auth.dto;

import java.util.List;

public record LoginResponse(
    String accessToken,
    String refreshToken,
    String userId,
    String email,
    String fullName,
    List<String> roles
) {}
