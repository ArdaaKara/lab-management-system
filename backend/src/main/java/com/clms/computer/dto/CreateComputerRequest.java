package com.clms.computer.dto;

import com.clms.computer.dto.HardwareSpecs;
import jakarta.validation.constraints.NotBlank;

public record CreateComputerRequest(
        @NotBlank String labId,
        @NotBlank String assetTag,
        String hostname,
        @NotBlank String macAddress,
        String ipAddress,
        Integer gridRow,
        Integer gridCol,
        HardwareSpecs hardwareSpecs
) {}
