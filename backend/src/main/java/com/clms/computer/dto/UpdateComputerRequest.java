package com.clms.computer.dto;

import com.clms.computer.entity.ComputerStatus;
import com.clms.computer.entity.HardwareSpecs;

public record UpdateComputerRequest(
        String assetTag,
        String hostname,
        String ipAddress,
        Integer gridRow,
        Integer gridCol,
        ComputerStatus status,
        HardwareSpecs hardwareSpecs
) {}
