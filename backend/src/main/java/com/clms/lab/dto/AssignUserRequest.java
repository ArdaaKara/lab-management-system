package com.clms.lab.dto;

import jakarta.validation.constraints.NotBlank;

public record AssignUserRequest(
        @NotBlank String userId
) {
}
