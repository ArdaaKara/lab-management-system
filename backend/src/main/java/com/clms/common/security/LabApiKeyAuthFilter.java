package com.clms.common.security;

import com.clms.common.dto.ApiResponse;
import com.clms.lab.repository.LabRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class LabApiKeyAuthFilter extends OncePerRequestFilter {

    private final LabRepository labRepository;
    private final ObjectMapper objectMapper;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return !request.getServletPath().startsWith("/api/hardware-sync/");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String apiKey = request.getHeader("X-Lab-Api-Key");

        if (apiKey == null || apiKey.isBlank()) {
            response.setStatus(401);
            response.setContentType("application/json;charset=UTF-8");
            objectMapper.writeValue(response.getOutputStream(), ApiResponse.error("X-Lab-Api-Key header eksik"));
            return;
        }

        var labOpt = labRepository.findByLabApiKey(apiKey);
        if (labOpt.isEmpty()) {
            response.setStatus(401);
            response.setContentType("application/json;charset=UTF-8");
            objectMapper.writeValue(response.getOutputStream(), ApiResponse.error("Geçersiz Lab API anahtarı"));
            return;
        }

        request.setAttribute("authenticatedLabId", labOpt.get().getId());
        filterChain.doFilter(request, response);
    }
}
