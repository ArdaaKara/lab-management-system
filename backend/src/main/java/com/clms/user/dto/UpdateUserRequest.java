package com.clms.user.dto;

import jakarta.validation.constraints.Size;
import java.util.List;

public record UpdateUserRequest(
        @Size(max = 120) String fullName,
        Boolean isActive,
        List<String> roleNames
) {
}
