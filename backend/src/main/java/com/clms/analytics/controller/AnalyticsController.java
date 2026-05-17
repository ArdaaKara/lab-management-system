package com.clms.analytics.controller;

import com.clms.analytics.dto.LabSummaryResponse;
import com.clms.analytics.service.AnalyticsService;
import com.clms.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/labs/{labId}/summary")
    public ApiResponse<LabSummaryResponse> getLabSummary(@PathVariable String labId) {
        return ApiResponse.ok(analyticsService.getLabSummary(labId));
    }
}
