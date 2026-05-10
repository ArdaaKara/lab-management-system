package com.clms.issue.repository;

import com.clms.issue.entity.IssueHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IssueHistoryRepository extends JpaRepository<IssueHistory, String> {

    List<IssueHistory> findByIssueIdOrderByChangedAtDesc(String issueId);

    List<IssueHistory> findByIssueIdOrderByChangedAtAsc(String issueId);
}
