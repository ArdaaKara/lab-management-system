package com.clms.lab.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

public record UpdateLabRequest(
        @Size(max = 100) String name,
        @Size(max = 20) String roomNumber,
        @Min(1) @Max(20) Integer maxRows,
        @Min(1) @Max(20) Integer maxCols
) {
}
