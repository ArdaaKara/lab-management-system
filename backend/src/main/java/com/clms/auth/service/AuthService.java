package com.clms.auth.service;

import com.clms.auth.dto.LoginRequest;
import com.clms.auth.dto.LoginResponse;
import com.clms.auth.dto.RefreshRequest;
import com.clms.auth.entity.RefreshToken;
import com.clms.auth.mapper.AuthMapper;
import com.clms.auth.repository.RefreshTokenRepository;
import com.clms.common.exception.UnauthorizedException;
import com.clms.common.security.ClmsUserDetails;
import com.clms.common.security.ClmsUserDetailsService;
import com.clms.user.entity.User;
import com.clms.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.HexFormat;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final ClmsUserDetailsService clmsUserDetailsService;
    private final AuthMapper authMapper;

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new UnauthorizedException("Geçersiz email veya şifre"));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new UnauthorizedException("Geçersiz email veya şifre");
        }

        if (!user.isActive()) {
            throw new UnauthorizedException("Hesap devre dışı");
        }

        ClmsUserDetails userDetails = new ClmsUserDetails(user);
        String accessToken = jwtService.generateAccessToken(userDetails);

        String rawRefreshToken = UUID.randomUUID().toString();
        String tokenHash = hashToken(rawRefreshToken);

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUserId(user.getId());
        refreshToken.setTokenHash(tokenHash);
        refreshToken.setExpiresAt(Instant.now().plus(7, ChronoUnit.DAYS));
        refreshToken.setRevoked(false);
        refreshTokenRepository.save(refreshToken);

        return authMapper.toLoginResponse(user, accessToken, rawRefreshToken);
    }

    public LoginResponse refresh(RefreshRequest request) {
        String hash = hashToken(request.refreshToken());
        RefreshToken tokenEntity = refreshTokenRepository.findByTokenHash(hash)
                .orElseThrow(() -> new UnauthorizedException("Geçersiz refresh token"));

        if (tokenEntity.isRevoked()) {
            refreshTokenRepository.revokeAllByUserId(tokenEntity.getUserId());
            throw new UnauthorizedException("Güvenlik ihlali tespit edildi. Lütfen tekrar giriş yapın.");
        }

        if (tokenEntity.getExpiresAt().isBefore(Instant.now())) {
            throw new UnauthorizedException("Refresh token süresi dolmuş");
        }

        tokenEntity.setRevoked(true);
        refreshTokenRepository.save(tokenEntity);

        String newRawRefreshToken = UUID.randomUUID().toString();
        String newHash = hashToken(newRawRefreshToken);

        RefreshToken newToken = new RefreshToken();
        newToken.setUserId(tokenEntity.getUserId());
        newToken.setTokenHash(newHash);
        newToken.setExpiresAt(Instant.now().plus(7, ChronoUnit.DAYS));
        newToken.setRevoked(false);
        refreshTokenRepository.save(newToken);

        User user = userRepository.findById(tokenEntity.getUserId())
                .orElseThrow(() -> new UnauthorizedException("Kullanıcı bulunamadı"));

        ClmsUserDetails userDetails = new ClmsUserDetails(user);
        String accessToken = jwtService.generateAccessToken(userDetails);

        return authMapper.toLoginResponse(user, accessToken, newRawRefreshToken);
    }

    public void logout(String rawRefreshToken) {
        String hash = hashToken(rawRefreshToken);
        refreshTokenRepository.findByTokenHash(hash).ifPresent(token -> {
            token.setRevoked(true);
            refreshTokenRepository.save(token);
        });
    }

    @Scheduled(cron = "0 0 3 * * *")
    public void cleanExpiredTokens() {
        refreshTokenRepository.deleteExpiredAndRevoked();
        log.info("Süresi dolmuş refresh token'lar temizlendi");
    }

    private String hashToken(String token) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] digest = md.digest(token.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(digest);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algoritması bulunamadı", e);
        }
    }
}
