package com.clms.issue.dto;

import com.clms.issue.entity.IssueStatus;
import java.time.Instant;

public record IssueHistoryResponse(
        String id,
        IssueStatus oldStatus,
        IssueStatus newStatus,
        String note,
        String changedByUserName,
        Instant changedAt
) {}
