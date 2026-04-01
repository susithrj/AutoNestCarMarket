package com.autonest.service;

import com.autonest.dto.request.LoginRequest;
import com.autonest.dto.request.RegisterRequest;
import com.autonest.dto.response.AuthResponse;
import com.autonest.model.RefreshToken;
import com.autonest.model.User;
import com.autonest.model.enums.Role;
import com.autonest.repository.RefreshTokenRepository;
import com.autonest.repository.UserRepository;
import com.autonest.security.JwtUtil;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.NoSuchElementException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {
  private final UserRepository userRepository;
  private final RefreshTokenRepository refreshTokenRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtUtil jwtUtil;
  private final Duration refreshTokenTtl;
  private final SecureRandom secureRandom = new SecureRandom();

  public AuthService(
      UserRepository userRepository,
      RefreshTokenRepository refreshTokenRepository,
      PasswordEncoder passwordEncoder,
      JwtUtil jwtUtil,
      @Value("${autonest.auth.refresh-ttl-seconds:604800}") long refreshTtlSeconds
  ) {
    this.userRepository = userRepository;
    this.refreshTokenRepository = refreshTokenRepository;
    this.passwordEncoder = passwordEncoder;
    this.jwtUtil = jwtUtil;
    this.refreshTokenTtl = Duration.ofSeconds(refreshTtlSeconds);
  }

  @Transactional
  public void registerBuyer(RegisterRequest request) {
    if (userRepository.existsByEmail(request.getEmail())) {
      throw new IllegalArgumentException("Email already registered");
    }
    if (userRepository.existsByUsername(request.getUsername())) {
      throw new IllegalArgumentException("Username already registered");
    }
    User user = new User();
    user.setUsername(request.getUsername());
    user.setEmail(request.getEmail());
    user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
    user.setRole(Role.BUYER);
    user.setActive(true);
    user.setCreatedAt(Instant.now());
    userRepository.save(user);
  }

  @Transactional
  public LoginResult login(LoginRequest request) {
    User user = userRepository.findByEmail(request.getEmail()).orElseThrow(NoSuchElementException::new);
    if (!user.isActive()) {
      throw new IllegalArgumentException("User is inactive");
    }
    if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
      throw new IllegalArgumentException("Invalid credentials");
    }

    AuthResponse response = new AuthResponse();
    response.setAccessToken(jwtUtil.createAccessToken(user));
    response.setExpiresInSeconds(jwtUtil.getAccessTokenTtlSeconds());
    response.setUserId(user.getId());
    response.setEmail(user.getEmail());
    response.setRole(user.getRole());

    String refresh = issueRefreshToken(user);
    return new LoginResult(response, refresh);
  }

  @Transactional
  public LoginResult refresh(String refreshTokenValue) {
    RefreshToken token = refreshTokenRepository.findByToken(refreshTokenValue).orElseThrow(NoSuchElementException::new);
    if (token.isRevoked()) {
      throw new IllegalArgumentException("Refresh token revoked");
    }
    if (token.getExpiresAt() != null && token.getExpiresAt().isBefore(Instant.now())) {
      throw new IllegalArgumentException("Refresh token expired");
    }

    token.setRevoked(true);
    refreshTokenRepository.save(token);

    User user = token.getUser();
    AuthResponse response = new AuthResponse();
    response.setAccessToken(jwtUtil.createAccessToken(user));
    response.setExpiresInSeconds(jwtUtil.getAccessTokenTtlSeconds());
    response.setUserId(user.getId());
    response.setEmail(user.getEmail());
    response.setRole(user.getRole());

    String newRefresh = issueRefreshToken(user);
    return new LoginResult(response, newRefresh);
  }

  @Transactional
  public void logout(String refreshTokenValue) {
    if (refreshTokenValue == null || refreshTokenValue.isBlank()) {
      return;
    }
    refreshTokenRepository.findByToken(refreshTokenValue).ifPresent(t -> {
      t.setRevoked(true);
      refreshTokenRepository.save(t);
    });
  }

  private String issueRefreshToken(User user) {
    byte[] bytes = new byte[48];
    secureRandom.nextBytes(bytes);
    String tokenValue = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);

    RefreshToken token = new RefreshToken();
    token.setUser(user);
    token.setToken(tokenValue);
    token.setExpiresAt(Instant.now().plus(refreshTokenTtl));
    token.setRevoked(false);
    refreshTokenRepository.save(token);
    return tokenValue;
  }

  public record LoginResult(AuthResponse auth, String refreshToken) {}
}

