package com.clms.lab.controller;

import com.clms.common.dto.ApiResponse;
import com.clms.lab.dto.AssignUserRequest;
import com.clms.lab.dto.CreateLabRequest;
import com.clms.lab.dto.LabResponse;
import com.clms.lab.dto.UpdateLabRequest;
import com.clms.lab.service.LabService;
import com.clms.common.security.ClmsUserDetails;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/labs")
@RequiredArgsConstructor
@Validated
public class LabController {

    private final LabService labService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<ApiResponse<List<LabResponse>>> getAllLabs(@AuthenticationPrincipal ClmsUserDetails principal) {
        boolean isAdmin = principal.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        
        List<LabResponse> labs;
        if (isAdmin) {
            labs = labService.getAllLabs();
        } else {
            labs = labService.getLabsForUser(principal.getUser().getId());
        }
        
        return ResponseEntity.ok(ApiResponse.success(labs));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<ApiResponse<LabResponse>> getLabById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(labService.getLabById(id)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<LabResponse>> createLab(@Valid @RequestBody CreateLabRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(labService.createLab(request), "Laboratuvar oluşturuldu"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<LabResponse>> updateLab(
            @PathVariable String id, 
            @Valid @RequestBody UpdateLabRequest request) {
        return ResponseEntity.ok(ApiResponse.success(labService.updateLab(id, request), "Laboratuvar güncellendi"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteLab(@PathVariable String id) {
        labService.deleteLab(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/assign")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<ApiResponse<Void>> assignUser(
            @PathVariable String id, 
            @Valid @RequestBody AssignUserRequest request) {
        labService.assignUser(id, request);
        return ResponseEntity.ok(ApiResponse.success(null, "Kullanıcı laboratuvara atandı"));
    }

    @DeleteMapping("/{id}/users/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<ApiResponse<Void>> removeUser(
            @PathVariable String id, 
            @PathVariable String userId) {
        labService.removeUser(id, userId);
        return ResponseEntity.noContent().build();
    }
}
