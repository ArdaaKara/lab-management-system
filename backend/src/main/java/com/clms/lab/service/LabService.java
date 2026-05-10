package com.clms.lab.service;

import com.clms.common.exception.ConflictException;
import com.clms.common.exception.ResourceNotFoundException;
import com.clms.lab.dto.AssignUserRequest;
import com.clms.lab.dto.CreateLabRequest;
import com.clms.lab.dto.LabResponse;
import com.clms.lab.dto.UpdateLabRequest;
import com.clms.lab.entity.Lab;
import com.clms.lab.entity.LabAssignment;
import com.clms.lab.mapper.LabMapper;
import com.clms.lab.repository.LabAssignmentRepository;
import com.clms.lab.repository.LabRepository;
import com.clms.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class LabService {

    private final LabRepository labRepository;
    private final LabAssignmentRepository labAssignmentRepository;
    private final UserRepository userRepository;
    private final LabMapper labMapper;

    @Transactional(readOnly = true)
    public List<LabResponse> getAllLabs() {
        return labRepository.findAllWithAssignments().stream()
                .map(labMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public LabResponse getLabById(String id) {
        return labRepository.findByIdWithAssignments(id)
                .map(labMapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Laboratuvar", id));
    }

    public LabResponse createLab(CreateLabRequest request) {
        String apiKey = UUID.randomUUID().toString().replace("-", "");
        
        Lab lab = Lab.builder()
                .name(request.name())
                .roomNumber(request.roomNumber())
                .maxRows(request.maxRows())
                .maxCols(request.maxCols())
                .labApiKey(apiKey)
                .build();
        
        return labMapper.toResponse(labRepository.save(lab));
    }

    public LabResponse updateLab(String id, UpdateLabRequest request) {
        Lab lab = labRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Laboratuvar", id));
        
        lab.setName(request.name());
        lab.setRoomNumber(request.roomNumber());
        lab.setMaxRows(request.maxRows());
        lab.setMaxCols(request.maxCols());
        
        return labMapper.toResponse(labRepository.save(lab));
    }

    public void deleteLab(String id) {
        Lab lab = labRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Laboratuvar", id));
        
        try {
            labRepository.delete(lab);
        } catch (Exception e) {
            throw new ConflictException("Laboratuvar silinemedi. Bağlı bilgisayarlar olabilir.");
        }
    }

    public void assignUser(String labId, AssignUserRequest request) {
        if (!labRepository.existsById(labId)) {
            throw new ResourceNotFoundException("Laboratuvar", labId);
        }
        if (!userRepository.existsById(request.userId())) {
            throw new ResourceNotFoundException("Kullanıcı", request.userId());
        }

        labAssignmentRepository.findByUserIdAndLabId(request.userId(), labId)
                .ifPresent(a -> { throw new ConflictException("Kullanıcı zaten bu laba atanmış"); });

        LabAssignment assignment = LabAssignment.builder()
                .userId(request.userId())
                .labId(labId)
                .build();
        
        labAssignmentRepository.save(assignment);
    }

    public void removeUser(String labId, String userId) {
        labAssignmentRepository.findByUserIdAndLabId(userId, labId)
                .orElseThrow(() -> new ResourceNotFoundException("Atama", userId + " - " + labId));
        
        labAssignmentRepository.deleteByUserIdAndLabId(userId, labId);
    }

    @Transactional(readOnly = true)
    public List<LabResponse> getLabsForUser(String userId) {
        return labAssignmentRepository.findByUserId(userId).stream()
                .map(a -> labRepository.findById(a.getLabId()).orElse(null))
                .filter(java.util.Objects::nonNull)
                .map(labMapper::toResponse)
                .toList();
    }
}
