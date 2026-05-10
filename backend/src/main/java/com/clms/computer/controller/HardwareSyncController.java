package com.clms.computer.controller;

import com.clms.common.dto.ApiResponse;
import com.clms.computer.dto.ComputerResponse;
import com.clms.computer.dto.HardwareSyncRequest;
import com.clms.computer.service.HardwareSyncService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/hardware-sync")
@RequiredArgsConstructor
public class HardwareSyncController {

    private final HardwareSyncService hardwareSyncService;

    @PostMapping
    public ApiResponse<ComputerResponse> sync(@Valid @RequestBody HardwareSyncRequest request, HttpServletRequest httpRequest) {
        String labId = (String) httpRequest.getAttribute("authenticatedLabId");
        return ApiResponse.ok(hardwareSyncService.sync(labId, request));
    }
}
