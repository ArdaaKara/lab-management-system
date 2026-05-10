package com.clms.computer.dto;

import com.clms.computer.entity.ComputerStatus;
import com.clms.computer.entity.HardwareSpecs;
import java.time.Instant;

public record ComputerResponse(
        String id,
        String assetTag,
        String hostname,
        String macAddress,
        String ipAddress,
        Integer gridRow,
        Integer gridCol,
        ComputerStatus status,
        HardwareSpecs hardwareSpecs,
        boolean isActive,
        Instant lastSeenAt,
        String labId,
        Instant createdAt
) {}
