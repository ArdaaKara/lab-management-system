package com.clms.common.config;

import com.clms.common.dto.ApiResponse;
import com.clms.common.security.ClmsUserDetailsService;
import com.clms.common.security.JwtAuthenticationFilter;
import com.clms.common.security.LabApiKeyAuthFilter;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final LabApiKeyAuthFilter labApiKeyAuthFilter;
    private final ClmsUserDetailsService clmsUserDetailsService;
    private final ObjectMapper objectMapper;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(clmsUserDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/actuator/health").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/auth/login", "/api/auth/refresh").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/computers/*/issues").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/computers/*/public").permitAll()
                .requestMatchers("/api/users/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/labs/**", "/api/computers/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/labs/**", "/api/computers/**").hasAnyRole("ADMIN", "TEACHER")
                .requestMatchers(HttpMethod.PUT, "/api/labs/**", "/api/computers/**").hasAnyRole("ADMIN", "TEACHER")
                .requestMatchers(HttpMethod.PATCH, "/api/computers/*/decommission").hasRole("ADMIN")
                .requestMatchers("/api/hardware-sync/**").permitAll()
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
            .addFilterBefore(labApiKeyAuthFilter, JwtAuthenticationFilter.class)
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint((req, res, e) -> {
                    res.setStatus(401);
                    res.setContentType("application/json;charset=UTF-8");
                    objectMapper.writeValue(res.getOutputStream(), ApiResponse.error("Kimlik doğrulama gerekli"));
                })
                .accessDeniedHandler((req, res, e) -> {
                    res.setStatus(403);
                    res.setContentType("application/json;charset=UTF-8");
                    objectMapper.writeValue(res.getOutputStream(), ApiResponse.error("Bu işlem için yetkiniz yok"));
                })
            );

        return http.build();
    }
}
