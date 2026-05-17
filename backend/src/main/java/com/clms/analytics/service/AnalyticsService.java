package com.clms.analytics.service;

import com.clms.analytics.dto.LabSummaryResponse;
import com.clms.analytics.dto.TopFaultyComputer;
import com.clms.computer.entity.Computer;
import com.clms.computer.entity.ComputerStatus;
import com.clms.computer.repository.ComputerRepository;
import com.clms.issue.entity.Issue;
import com.clms.issue.entity.IssueStatus;
import com.clms.issue.repository.IssueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AnalyticsService {

    private final ComputerRepository computerRepository;
    private final IssueRepository issueRepository;

    public LabSummaryResponse getLabSummary(String labId) {
        List<Computer> computers = computerRepository.findByLabIdAndIsActiveTrue(labId);

        int totalComputers = computers.size();
        long activeCount = computers.stream().filter(c -> c.getStatus() == ComputerStatus.ACTIVE).count();
        long faultyCount = computers.stream().filter(c -> c.getStatus() == ComputerStatus.FAULTY).count();
        long underRepairCount = computers.stream().filter(c -> c.getStatus() == ComputerStatus.UNDER_REPAIR).count();

        List<Issue> resolvedIssues = issueRepository.findByComputerLabIdAndStatus(labId, IssueStatus.RESOLVED);
        double avgResolutionMinutes = resolvedIssues.stream()
                .mapToLong(i -> Duration.between(i.getCreatedAt(), i.getUpdatedAt()).toMinutes())
                .average()
                .orElse(0.0);

        List<Object[]> rows = issueRepository.findTopFaultyComputersByLabId(labId, PageRequest.of(0, 5));
        List<TopFaultyComputer> topFaultyComputers = rows.stream()
                .map(r -> new TopFaultyComputer(
                        (String) r[0],
                        (String) r[1],
                        (String) r[2],
                        ((Number) r[3]).longValue()))
                .toList();

        return new LabSummaryResponse(
                totalComputers,
                activeCount,
                faultyCount,
                underRepairCount,
                avgResolutionMinutes,
                topFaultyComputers
        );
    }
}
