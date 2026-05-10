package com.clms.lab.mapper;

import com.clms.lab.dto.LabResponse;
import com.clms.lab.entity.Lab;
import com.clms.lab.entity.LabAssignment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public abstract class LabMapper {

    @Mapping(target = "assignedUserIds", source = "assignments")
    public abstract LabResponse toResponse(Lab lab);

    public List<String> mapAssignedUserIds(java.util.Set<LabAssignment> assignments) {
        if (assignments == null) return List.of();
        return assignments.stream().map(LabAssignment::getUserId).toList();
    }
}