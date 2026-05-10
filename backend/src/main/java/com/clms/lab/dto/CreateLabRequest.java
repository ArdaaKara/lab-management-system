package com.clms.lab.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateLabRequest(
        @NotBlank @Size(max = 100) String name,
        @NotBlank @Size(max = 20) String roomNumber,
        @Min(1) @Max(20) int maxRows,
        @Min(1) @Max(20) int maxCols
) {
}
