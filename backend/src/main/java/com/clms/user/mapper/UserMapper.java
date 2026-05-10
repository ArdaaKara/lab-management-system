package com.clms.user.mapper;

import com.clms.user.dto.UserResponse;
import com.clms.user.entity.Role;
import com.clms.user.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;
import java.util.Set;

@Mapper(componentModel = "spring")
public abstract class UserMapper {

    @Mapping(target = "roles", source = "roles")
    public abstract UserResponse toResponse(User user);

    public List<String> mapRoles(java.util.Set<Role> roles) {
        if (roles == null) return List.of();
        return roles.stream().map(Role::getName).toList();
    }
}