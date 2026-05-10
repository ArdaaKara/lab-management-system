package com.clms.computer.dto;

import com.clms.computer.entity.HardwareSpecs;

public record HardwareSyncRequest(
        String macAddress,
        String hostname,
        String ipAddress,
        HardwareSpecs hardwareSpecs
) {}