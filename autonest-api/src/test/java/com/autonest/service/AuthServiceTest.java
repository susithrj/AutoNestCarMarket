package com.autonest.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.autonest.dto.request.LoginRequest;
import com.autonest.dto.request.RegisterRequest;
import com.autonest.model.RefreshToken;
import com.autonest.model.User;
import com.autonest.model.enums.Role;
import com.autonest.repository.RefreshTokenRepository;
import com.autonest.repository.UserRepository;
import com.autonest.security.JwtUtil;
import java.time.Instant;
import java.util.NoSuchElementException;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.password.PasswordEncoder;

class AuthServiceTest {

  @Test
  void registerBuyer_rejectsDuplicateEmail() {
    UserRepository userRepository = mock(UserRepository.class);
    RefreshTokenRepository refreshTokenRepository = mock(RefreshTokenRepository.class);
    PasswordEncoder passwordEncoder = mock(PasswordEncoder.class);
    JwtUtil jwtUtil = mock(JwtUtil.class);
    AuthService service = new AuthService(userRepository, refreshTokenRepository, passwordEncoder, jwtUtil, 604800);

    when(userRepository.existsByEmail("a@b.com")).thenReturn(true);

    RegisterRequest req = new RegisterRequest();
    req.setUsername("u");
    req.setEmail("a@b.com");
    req.setPassword("p");

    assertThrows(IllegalArgumentException.class, () -> service.registerBuyer(req));
  }

  @Test
  void login_returnsAccessTokenAndCreatesRefreshToken() {
    UserRepository userRepository = mock(UserRepository.class);
    RefreshTokenRepository refreshTokenRepository = mock(RefreshTokenRepository.class);
    PasswordEncoder passwordEncoder = mock(PasswordEncoder.class);
    JwtUtil jwtUtil = mock(JwtUtil.class);

    AuthService service = new AuthService(userRepository, refreshTokenRepository, passwordEncoder, jwtUtil, 604800);

    User user = new User();
    user.setId(10L);
    user.setEmail("admin@autonest.com");
    user.setPasswordHash("hash");
    user.setRole(Role.ADMIN);
    user.setActive(true);
    user.setCreatedAt(Instant.now());

    when(userRepository.findByEmail("admin@autonest.com")).thenReturn(Optional.of(user));
    when(passwordEncoder.matches(eq("pw"), eq("hash"))).thenReturn(true);
    when(jwtUtil.createAccessToken(user)).thenReturn("access");
    when(jwtUtil.getAccessTokenTtlSeconds()).thenReturn(900L);

    LoginRequest req = new LoginRequest();
    req.setEmail("admin@autonest.com");
    req.setPassword("pw");

    AuthService.LoginResult result = service.login(req);
    assertNotNull(result);
    assertEquals("access", result.auth().getAccessToken());
    assertEquals(900L, result.auth().getExpiresInSeconds());
    assertNotNull(result.refreshToken());

    verify(refreshTokenRepository).save(any(RefreshToken.class));
  }

  @Test
  void refresh_rejectsMissingToken() {
    UserRepository userRepository = mock(UserRepository.class);
    RefreshTokenRepository refreshTokenRepository = mock(RefreshTokenRepository.class);
    PasswordEncoder passwordEncoder = mock(PasswordEncoder.class);
    JwtUtil jwtUtil = mock(JwtUtil.class);

    AuthService service = new AuthService(userRepository, refreshTokenRepository, passwordEncoder, jwtUtil, 604800);
    when(refreshTokenRepository.findByToken("nope")).thenReturn(Optional.empty());

    assertThrows(NoSuchElementException.class, () -> service.refresh("nope"));
  }
}

