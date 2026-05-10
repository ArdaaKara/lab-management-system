package com.clms.issue.dto;

import com.clms.issue.entity.IssueCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CreateIssueRequest(
        String computerId,
        
        @NotBlank 
        @Pattern(regexp="^[0-9]{6,}$") 
        String studentIdReporter,
        
        @NotNull 
        IssueCategory category,
        
        @Size(max = 500) 
        String description
) {}
