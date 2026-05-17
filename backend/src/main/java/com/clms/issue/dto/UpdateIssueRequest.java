package com.clms.issue.dto;

import com.clms.issue.entity.IssueCategory;

public record UpdateIssueRequest(
        IssueCategory category,
        String description
) {}
