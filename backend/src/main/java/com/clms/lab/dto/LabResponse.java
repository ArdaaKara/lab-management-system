package com.clms.lab.dto;

import java.time.Instant;
import java.util.List;

public record LabResponse(
        String id,
        String name,
        String roomNumber,
        int maxRows,
        int maxCols,
        List<String> assignedUserIds,
        Instant createdAt
) {
}
