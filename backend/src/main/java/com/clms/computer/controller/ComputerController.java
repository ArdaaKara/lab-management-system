package com.clms.computer.controller;

import com.clms.common.dto.ApiResponse;
import com.clms.computer.dto.ComputerGridResponse;
import com.clms.computer.dto.ComputerResponse;
import com.clms.computer.dto.CreateComputerRequest;
import com.clms.computer.dto.UpdateComputerRequest;
import com.clms.computer.service.ComputerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/computers")
@RequiredArgsConstructor
@Validated
public class ComputerController {

    private final ComputerService computerService;

    @GetMapping("/lab/{labId}")
    public ApiResponse<List<ComputerResponse>> getAllByLab(@PathVariable String labId) {
        return ApiResponse.ok(computerService.getAllByLab(labId));
    }

    @GetMapping("/lab/{labId}/grid")
    public ApiResponse<ComputerGridResponse> getGridByLab(@PathVariable String labId) {
        return ApiResponse.ok(computerService.getGridByLab(labId));
    }

    @GetMapping("/{id}")
    public ApiResponse<ComputerResponse> getById(@PathVariable String id) {
        return ApiResponse.ok(computerService.getById(id));
    }

    @GetMapping("/{id}/public")
    public ApiResponse<ComputerResponse> getPublicInfo(@PathVariable String id) {
        return ApiResponse.ok(computerService.getPublicInfo(id));
    }

    @GetMapping("/{id}/qr")
    public ResponseEntity<byte[]> getQrCode(@PathVariable String id) {
        byte[] qrCode = computerService.getQrCode(id);
        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_PNG)
                .body(qrCode);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<ComputerResponse> create(@Valid @RequestBody CreateComputerRequest request) {
        return ApiResponse.created(computerService.create(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<ComputerResponse> update(@PathVariable String id,
            @Valid @RequestBody UpdateComputerRequest request) {
        return ApiResponse.ok(computerService.update(id, request));
    }

    @PatchMapping("/{id}/decommission")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void decommission(@PathVariable String id) {
        computerService.decommission(id);
    }
}
