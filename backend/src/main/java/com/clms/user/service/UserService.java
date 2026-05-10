package com.clms.user.service;

import com.clms.common.exception.ConflictException;
import com.clms.common.exception.ResourceNotFoundException;
import com.clms.user.dto.CreateUserRequest;
import com.clms.user.dto.UpdateUserRequest;
import com.clms.user.dto.UserResponse;
import com.clms.user.entity.Role;
import com.clms.user.entity.User;
import com.clms.user.mapper.UserMapper;
import com.clms.user.repository.RoleRepository;
import com.clms.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userRepository.findAllWithRoles().stream()
                .map(userMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public UserResponse getUserById(String id) {
        return userRepository.findById(id)
                .map(userMapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Kullanıcı", id));
    }

    public UserResponse createUser(CreateUserRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new ConflictException("Bu email zaten kayıtlı");
        }

        Set<Role> roles = request.roleNames().stream()
                .map(roleName -> roleRepository.findByName(roleName)
                        .orElseThrow(() -> new ResourceNotFoundException("Rol", roleName)))
                .collect(Collectors.toSet());

        User user = User.builder()
                .fullName(request.fullName())
                .email(request.email())
                .passwordHash(passwordEncoder.encode(request.password()))
                .isActive(true)
                .roles(roles)
                .build();

        return userMapper.toResponse(userRepository.save(user));
    }

    public UserResponse updateUser(String id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Kullanıcı", id));

        user.setFullName(request.fullName());
        user.setActive(request.isActive());

        if (request.roleNames() != null && !request.roleNames().isEmpty()) {
            Set<Role> roles = request.roleNames().stream()
                    .map(roleName -> roleRepository.findByName(roleName)
                            .orElseThrow(() -> new ResourceNotFoundException("Rol", roleName)))
                    .collect(Collectors.toSet());
            user.setRoles(roles);
        }

        return userMapper.toResponse(userRepository.save(user));
    }

    public void deleteUser(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Kullanıcı", id));
        user.setActive(false);
        userRepository.save(user);
    }
}
