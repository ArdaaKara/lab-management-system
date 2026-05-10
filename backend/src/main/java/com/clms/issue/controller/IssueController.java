package com.clms.issue.controller;

import com.clms.common.dto.ApiResponse;
import com.clms.issue.dto.IssueHistoryResponse;
import com.clms.issue.dto.IssueResponse;
import com.clms.issue.dto.RejectIssueRequest;
import com.clms.issue.entity.IssueStatus;
import com.clms.issue.service.IssueService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/issues")
@RequiredArgsConstructor
@Validated
public class IssueController {

    private final IssueService issueService;

    @GetMapping
    public ApiResponse<List<IssueResponse>> getAllIssues(@RequestParam(required = false) IssueStatus status) {
        return ApiResponse.ok(issueService.getAllIssues(status));
    }

    @GetMapping("/my")
    public ApiResponse<List<IssueResponse>> getMyIssues(Authentication authentication) {
        String technicianId = authentication.getName();
        return ApiResponse.ok(issueService.getMyIssues(technicianId));
    }

    @GetMapping("/{id}")
    public ApiResponse<IssueResponse> getIssueById(@PathVariable String id) {
        return ApiResponse.ok(issueService.getIssueById(id));
    }

    @GetMapping("/{id}/history")
    public ApiResponse<List<IssueHistoryResponse>> getIssueHistory(@PathVariable String id) {
        return ApiResponse.ok(issueService.getIssueHistory(id));
    }

    @PostMapping("/{id}/assign")
    public ApiResponse<IssueResponse> assignIssue(@PathVariable String id, @RequestParam String technicianId, Authentication auth) {
        return ApiResponse.ok(issueService.assignIssue(id, technicianId, auth));
    }

    @PostMapping("/{id}/submit")
    public ApiResponse<IssueResponse> submitForApproval(@PathVariable String id, Authentication auth) {
        return ApiResponse.ok(issueService.submitForApproval(id, auth));
    }

    @PostMapping("/{id}/resolve")
    public ApiResponse<IssueResponse> resolveIssue(@PathVariable String id, @RequestParam(required = false) String note, Authentication auth) {
        return ApiResponse.ok(issueService.resolveIssue(id, note, auth));
    }

    @PostMapping("/{id}/reject")
    public ApiResponse<IssueResponse> rejectIssue(@PathVariable String id, @Valid @RequestBody RejectIssueRequest request, Authentication auth) {
        return ApiResponse.ok(issueService.rejectIssue(id, request, auth));
    }
}
