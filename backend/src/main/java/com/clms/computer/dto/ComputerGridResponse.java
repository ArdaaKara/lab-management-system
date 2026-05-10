package com.clms.computer.dto;

import com.clms.computer.entity.ComputerStatus;
import java.time.Instant;
import java.util.List;

public record ComputerGridResponse(
        String labId,
        int maxRows,
        int maxCols,
        List<ComputerResponse> computers
) {}
