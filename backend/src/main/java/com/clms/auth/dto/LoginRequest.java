package com.clms.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
    @NotBlank(message = "Email boş bırakılamaz")
    @Email(message = "Geçersiz email formatı")
    String email,

    @NotBlank(message = "Şifre boş bırakılamaz")
    String password
) {}
