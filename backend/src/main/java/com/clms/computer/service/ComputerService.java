package com.clms.computer.service;

import com.clms.common.exception.ConflictException;
import com.clms.common.exception.ResourceNotFoundException;
import com.clms.computer.dto.ComputerGridResponse;
import com.clms.computer.dto.ComputerResponse;
import com.clms.computer.dto.CreateComputerRequest;
import com.clms.computer.dto.UpdateComputerRequest;
import com.clms.computer.entity.Computer;
import com.clms.computer.entity.ComputerStatus;
import com.clms.computer.mapper.ComputerMapper;
import com.clms.computer.repository.ComputerRepository;
import com.clms.lab.entity.Lab;
import com.clms.lab.repository.LabRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ComputerService {

    private final ComputerRepository computerRepository;
    private final LabRepository labRepository;
    private final ComputerMapper computerMapper;
    private final QrCodeService qrCodeService;

    @Transactional(readOnly = true)
    public List<ComputerResponse> getAllByLab(String labId) {
        return computerRepository.findByLabIdAndIsActiveTrue(labId)
                .stream()
                .map(computerMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ComputerResponse getById(String id) {
        Computer computer = computerRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Computer", id));
        return computerMapper.toResponse(computer);
    }

    @Transactional(readOnly = true)
    public ComputerGridResponse getGridByLab(String labId) {
        List<Computer> computers = computerRepository.findByLabIdWithGrid(labId);
        List<ComputerResponse> responses = computers.stream().map(computerMapper::toResponse).toList();
        int maxRows = computers.stream().mapToInt(c -> c.getGridRow() != null ? c.getGridRow() : 0).max().orElse(0);
        int maxCols = computers.stream().mapToInt(c -> c.getGridCol() != null ? c.getGridCol() : 0).max().orElse(0);
        return new ComputerGridResponse(labId, maxRows, maxCols, responses);
    }

    public ComputerResponse create(CreateComputerRequest request) {
        if (computerRepository.existsByAssetTag(request.assetTag())) {
            throw new ConflictException("Asset tag already exists: " + request.assetTag());
        }
        if (computerRepository.existsByMacAddress(request.macAddress())) {
            throw new ConflictException("MAC address already exists: " + request.macAddress());
        }
        checkGridConflict(request.labId(), request.gridRow(), request.gridCol(), null);

        Lab lab = labRepository.findById(request.labId())
                .orElseThrow(() -> new ResourceNotFoundException("Lab", request.labId()));

        Computer computer = new Computer();
        computer.setLab(lab);
        computer.setAssetTag(request.assetTag());
        computer.setHostname(request.hostname());
        computer.setMacAddress(request.macAddress());
        computer.setIpAddress(request.ipAddress());
        computer.setGridRow(request.gridRow());
        computer.setGridCol(request.gridCol());
        computer.setHardwareSpecs(request.hardwareSpecs());
        computer.setStatus(ComputerStatus.ACTIVE);
        computer.setActive(true);

        return computerMapper.toResponse(computerRepository.save(computer));
    }

    public ComputerResponse update(String id, UpdateComputerRequest request) {
        Computer computer = computerRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Computer", id));

        if (request.gridRow() != null || request.gridCol() != null) {
            Integer row = request.gridRow() != null ? request.gridRow() : computer.getGridRow();
            Integer col = request.gridCol() != null ? request.gridCol() : computer.getGridCol();
            if (!row.equals(computer.getGridRow()) || !col.equals(computer.getGridCol())) {
                checkGridConflict(computer.getLab().getId(), row, col, id);
            }
            computer.setGridRow(row);
            computer.setGridCol(col);
        }

        if (request.hostname() != null) computer.setHostname(request.hostname());
        if (request.ipAddress() != null) computer.setIpAddress(request.ipAddress());
        if (request.status() != null) computer.setStatus(request.status());
        if (request.hardwareSpecs() != null) computer.setHardwareSpecs(request.hardwareSpecs());

        return computerMapper.toResponse(computerRepository.save(computer));
    }

    public void decommission(String id) {
        Computer computer = computerRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Computer", id));
        computer.setStatus(ComputerStatus.DECOMMISSIONED);
        computer.setActive(false);
        computerRepository.save(computer);
    }

    @Transactional(readOnly = true)
    public byte[] getQrCode(String id) {
        computerRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Computer", id));
        String baseUrl = "http://localhost:8080";
        return qrCodeService.generateQrCode(id, baseUrl);
    }

    @Transactional(readOnly = true)
    public ComputerResponse getPublicInfo(String id) {
        Computer computer = computerRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Computer", id));
        return computerMapper.toResponse(computer);
    }

    private void checkGridConflict(String labId, Integer row, Integer col, String excludeComputerId) {
        if (row == null || col == null) return;
        List<Computer> gridComputers = computerRepository.findByLabIdWithGrid(labId);
        boolean conflict = gridComputers.stream().anyMatch(c ->
            c.getGridRow() != null && c.getGridRow().equals(row) &&
            c.getGridCol() != null && c.getGridCol().equals(col) &&
            (excludeComputerId == null || !c.getId().equals(excludeComputerId))
        );
        if (conflict) {
            throw new ConflictException("Bu grid pozisyonu dolu");
        }
    }
}