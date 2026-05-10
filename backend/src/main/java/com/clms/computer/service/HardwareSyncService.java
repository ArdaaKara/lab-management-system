package com.clms.computer.service;

import com.clms.common.exception.ResourceNotFoundException;
import com.clms.computer.dto.ComputerResponse;
import com.clms.computer.dto.HardwareSyncRequest;
import com.clms.computer.entity.Computer;
import com.clms.computer.mapper.ComputerMapper;
import com.clms.computer.repository.ComputerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
@RequiredArgsConstructor
@Transactional
public class HardwareSyncService {

    private final ComputerRepository computerRepository;
    private final ComputerMapper computerMapper;

    public ComputerResponse sync(String labId, HardwareSyncRequest request) {
        Computer computer = computerRepository.findByMacAddressAndLabId(request.macAddress(), labId)
                .orElseThrow(() -> new ResourceNotFoundException("Bilgisayar", request.macAddress()));

        computer.setHostname(request.hostname());
        computer.setIpAddress(request.ipAddress());
        computer.setHardwareSpecs(request.hardwareSpecs());
        computer.setLastSeenAt(Instant.now());

        return computerMapper.toResponse(computerRepository.save(computer));
    }
}
