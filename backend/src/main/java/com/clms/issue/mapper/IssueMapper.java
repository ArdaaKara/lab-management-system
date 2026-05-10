package com.clms.issue.mapper;

import com.clms.issue.dto.IssueHistoryResponse;
import com.clms.issue.dto.IssueResponse;
import com.clms.issue.entity.Issue;
import com.clms.issue.entity.IssueHistory;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface IssueMapper {

    @Mapping(source = "computer.id", target = "computerId")
    @Mapping(source = "computer.assetTag", target = "computerAssetTag")
    @Mapping(source = "assignedTechnician.id", target = "assignedTechnicianId")
    @Mapping(source = "assignedTechnician.fullName", target = "assignedTechnicianName")
    IssueResponse toResponse(Issue issue);

    List<IssueResponse> toResponseList(List<Issue> issues);

    @Mapping(source = "changedByUser.fullName", target = "changedByUserName")
    IssueHistoryResponse toHistoryResponse(IssueHistory issueHistory);

    List<IssueHistoryResponse> toHistoryResponseList(List<IssueHistory> issueHistories);
}
