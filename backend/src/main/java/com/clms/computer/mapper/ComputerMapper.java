package com.clms.computer.mapper;

import com.clms.computer.dto.ComputerGridResponse;
import com.clms.computer.dto.ComputerResponse;
import com.clms.computer.entity.Computer;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ComputerMapper {

    @Mapping(source = "lab.id", target = "labId")
    @Mapping(source = "active", target = "isActive")
    ComputerResponse toResponse(Computer computer);

    List<ComputerResponse> toResponseList(List<Computer> computers);

    @Mapping(source = "lab.id", target = "labId")
    ComputerGridResponse toGridResponse(Computer computer);

    List<ComputerGridResponse> toGridResponseList(List<Computer> computers);
}
