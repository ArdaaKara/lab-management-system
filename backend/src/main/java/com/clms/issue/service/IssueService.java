package com.clms.issue.service;

import com.clms.common.exception.RateLimitException;
import com.clms.common.exception.ResourceNotFoundException;
import com.clms.common.service.BucketService;
import com.clms.common.util.IpUtil;
import com.clms.computer.entity.Computer;
import com.clms.computer.repository.ComputerRepository;
import com.clms.issue.dto.CreateIssueRequest;
import com.clms.issue.dto.IssueHistoryResponse;
import com.clms.issue.dto.IssueResponse;
import com.clms.issue.dto.RejectIssueRequest;
import com.clms.issue.entity.Issue;
import com.clms.issue.entity.IssueHistory;
import com.clms.issue.entity.IssueStatus;
import com.clms.issue.mapper.IssueMapper;
import com.clms.issue.repository.IssueHistoryRepository;
import com.clms.issue.repository.IssueRepository;
import com.clms.user.entity.User;
import com.clms.user.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class IssueService {

    private final IssueRepository issueRepository;
    private final IssueHistoryRepository issueHistoryRepository;
    private final ComputerRepository computerRepository;
    private final UserRepository userRepository;
    private final IssueMapper issueMapper;
    private final BucketService bucketService;

    public IssueResponse createIssue(CreateIssueRequest request, HttpServletRequest httpRequest, String clientIp) {
        if (!bucketService.tryConsume(clientIp)) {
            throw new RateLimitException();
        }

        Computer computer = computerRepository.findByIdAndIsActiveTrue(request.computerId())
                .orElseThrow(() -> new ResourceNotFoundException("Computer", request.computerId()));

        Issue issue = new Issue();
        issue.setComputer(computer);
        issue.setCategory(request.category());
        issue.setDescription(request.description());
        issue.setStudentIdReporter(request.studentIdReporter());
        issue.setReporterIp(clientIp);
        issue.setStatus(IssueStatus.OPEN);

        Issue savedIssue = issueRepository.save(issue);
        saveHistory(savedIssue, null, IssueStatus.OPEN, null, "Issue created");

        return issueMapper.toResponse(savedIssue);
    }

    @Transactional(readOnly = true)
    public IssueResponse getIssueById(String id) {
        Issue issue = issueRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Issue", id));
        return issueMapper.toResponse(issue);
    }

    @Transactional(readOnly = true)
    public List<IssueResponse> getIssuesByComputer(String computerId) {
        return issueRepository.findByComputerId(computerId).stream()
                .map(issueMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<IssueResponse> getAllIssues(IssueStatus filterStatus) {
        List<Issue> issues = filterStatus == null ?
                issueRepository.findAll() :
                issueRepository.findByStatus(filterStatus);
        return issues.stream().map(issueMapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<IssueResponse> getMyIssues(String technicianId) {
        return issueRepository.findByAssignedTechnicianId(technicianId).stream()
                .map(issueMapper::toResponse)
                .toList();
    }

    public IssueResponse assignIssue(String issueId, String technicianId, Authentication auth) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Issue", issueId));

        if (issue.getStatus() != IssueStatus.OPEN) {
            throw new IllegalStateException("Issue can only be assigned when OPEN");
        }

        User technician = userRepository.findById(technicianId)
                .orElseThrow(() -> new ResourceNotFoundException("User", technicianId));

        issue.setStatus(IssueStatus.IN_PROGRESS);
        issue.setAssignedTechnician(technician);

        Issue savedIssue = issueRepository.save(issue);
        saveHistory(savedIssue, IssueStatus.OPEN, IssueStatus.IN_PROGRESS, auth.getName(), "Assigned to technician");

        return issueMapper.toResponse(savedIssue);
    }

    public IssueResponse submitForApproval(String issueId, Authentication auth) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Issue", issueId));

        if (issue.getStatus() != IssueStatus.IN_PROGRESS) {
            throw new IllegalStateException("Issue can only be submitted for approval when IN_PROGRESS");
        }

        issue.setStatus(IssueStatus.PENDING_APPROVAL);

        Issue savedIssue = issueRepository.save(issue);
        saveHistory(savedIssue, IssueStatus.IN_PROGRESS, IssueStatus.PENDING_APPROVAL, auth.getName(), "Submitted for approval");

        return issueMapper.toResponse(savedIssue);
    }

    public IssueResponse resolveIssue(String issueId, String note, Authentication auth) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Issue", issueId));

        if (issue.getStatus() != IssueStatus.PENDING_APPROVAL) {
            throw new IllegalStateException("Issue can only be resolved when PENDING_APPROVAL");
        }

        issue.setStatus(IssueStatus.RESOLVED);

        Issue savedIssue = issueRepository.save(issue);
        saveHistory(savedIssue, IssueStatus.PENDING_APPROVAL, IssueStatus.RESOLVED, auth.getName(), note != null ? note : "Resolved");

        return issueMapper.toResponse(savedIssue);
    }

    public IssueResponse rejectIssue(String issueId, RejectIssueRequest request, Authentication auth) {
        if (!StringUtils.hasText(request.reason())) {
            throw new IllegalArgumentException("Reason is required when rejecting an issue");
        }

        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Issue", issueId));

        if (issue.getStatus() != IssueStatus.PENDING_APPROVAL) {
            throw new IllegalStateException("Issue can only be rejected when PENDING_APPROVAL");
        }

        issue.setStatus(IssueStatus.REJECTED);

        Issue savedIssue = issueRepository.save(issue);
        saveHistory(savedIssue, IssueStatus.PENDING_APPROVAL, IssueStatus.REJECTED, auth.getName(), request.reason());

        return issueMapper.toResponse(savedIssue);
    }

    @Transactional(readOnly = true)
    public List<IssueHistoryResponse> getIssueHistory(String issueId) {
        return issueHistoryRepository.findByIssueIdOrderByChangedAtAsc(issueId).stream()
                .map(issueMapper::toHistoryResponse)
                .toList();
    }

    private void saveHistory(Issue issue, IssueStatus oldStatus, IssueStatus newStatus, String changedByUserId, String note) {
        User changedByUser = changedByUserId != null ? 
                userRepository.findById(changedByUserId).orElse(null) : null;

        IssueHistory history = IssueHistory.builder()
                .issue(issue)
                .oldStatus(oldStatus)
                .newStatus(newStatus)
                .changedByUser(changedByUser)
                .note(note)
                .changedAt(Instant.now())
                .build();

        issueHistoryRepository.save(history);
    }
}