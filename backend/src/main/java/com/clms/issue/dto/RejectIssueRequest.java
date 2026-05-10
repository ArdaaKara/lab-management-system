package com.clms.issue.dto;

import jakarta.validation.constraints.NotBlank;

public record RejectIssueRequest(
        @NotBlank String reason
) {}
