package com.clms.analytics.dto;

import java.util.List;

public record LabSummaryResponse(
        int totalComputers,
        long activeCount,
        long faultyCount,
        long underRepairCount,
        double avgResolutionMinutes,
        List<TopFaultyComputer> topFaultyComputers
) {}
