package com.clms.auth.mapper;

import com.clms.auth.dto.LoginResponse;
import com.clms.user.entity.Role;
import com.clms.user.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;
import java.util.Set;

@Mapper(componentModel = "spring")
public abstract class AuthMapper {

    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "email", source = "user.email")
    @Mapping(target = "fullName", source = "user.fullName")
    @Mapping(target = "roles", source = "user.roles")
    @Mapping(target = "accessToken", source = "accessToken")
    @Mapping(target = "refreshToken", source = "refreshToken")
    public abstract LoginResponse toLoginResponse(User user, String accessToken, String refreshToken);

    public List<String> mapRoles(Set<Role> roles) {
        if (roles == null) return List.of();
        return roles.stream().map(Role::getName).toList();
    }
}