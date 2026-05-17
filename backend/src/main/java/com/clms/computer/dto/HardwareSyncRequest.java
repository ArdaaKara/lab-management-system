package com.clms.computer.dto;

import com.clms.computer.dto.HardwareSpecs;

public record HardwareSyncRequest(
        String macAddress,
        String hostname,
        String ipAddress,
        HardwareSpecs hardwareSpecs
) {}