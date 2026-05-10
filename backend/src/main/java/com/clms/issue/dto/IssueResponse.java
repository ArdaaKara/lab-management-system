package com.clms.issue.dto;

import com.clms.issue.entity.IssueCategory;
import com.clms.issue.entity.IssueStatus;
import java.time.Instant;

public record IssueResponse(
        String id,
        String computerId,
        String computerAssetTag,
        IssueCategory category,
        String description,
        String studentIdReporter,
        IssueStatus status,
        String assignedTechnicianId,
        String assignedTechnicianName,
        Instant createdAt,
        Instant updatedAt
) {}
