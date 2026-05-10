package com.clms.computer.controller;

import com.clms.common.dto.ApiResponse;
import com.clms.common.util.IpUtil;
import com.clms.issue.dto.CreateIssueRequest;
import com.clms.issue.dto.IssueResponse;
import com.clms.issue.service.IssueService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/computers")
@RequiredArgsConstructor
public class PublicIssueController {

    private final IssueService issueService;

    @PostMapping("/{id}/issues")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<IssueResponse> createIssue(
            @PathVariable("id") String computerId,
            @Valid @RequestBody CreateIssueRequest request,
            HttpServletRequest httpRequest) {
        
        String clientIp = IpUtil.getClientIp(httpRequest);
        return ApiResponse.created(issueService.createIssue(request, httpRequest, clientIp));
    }
}
