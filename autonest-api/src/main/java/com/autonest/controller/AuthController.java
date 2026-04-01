package com.autonest.controller;

import com.autonest.dto.request.LoginRequest;
import com.autonest.dto.request.RegisterRequest;
import com.autonest.dto.response.AuthResponse;
import com.autonest.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;

@RestController
public class AuthController {
  private final AuthService authService;
  private final boolean refreshCookieSecure;
  private final String refreshCookieSameSite;

  public AuthController(
      AuthService authService,
      @Value("${autonest.auth.cookie.secure:false}") boolean refreshCookieSecure,
      @Value("${autonest.auth.cookie.same-site:Strict}") String refreshCookieSameSite
  ) {
    this.authService = authService;
    this.refreshCookieSecure = refreshCookieSecure;
    this.refreshCookieSameSite = refreshCookieSameSite;
  }

  @PostMapping("/api/auth/register")
  @ResponseStatus(HttpStatus.CREATED)
  public void register(@Valid @RequestBody RegisterRequest request) {
    authService.registerBuyer(request);
  }

  @PostMapping("/api/auth/login")
  public AuthResponse login(@Valid @RequestBody LoginRequest request, HttpServletResponse response) {
    AuthService.LoginResult result = authService.login(request);
    response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie(result.refreshToken()).toString());
    return result.auth();
  }

  @PostMapping("/api/auth/refresh")
  public AuthResponse refresh(@CookieValue(name = "refresh_token", required = false) String refreshToken,
                              HttpServletResponse response) {
    if (refreshToken == null || refreshToken.isBlank()) {
      throw new IllegalArgumentException("Missing refresh token");
    }
    AuthService.LoginResult result = authService.refresh(refreshToken);
    response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie(result.refreshToken()).toString());
    return result.auth();
  }

  @PostMapping("/api/auth/logout")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void logout(@CookieValue(name = "refresh_token", required = false) String refreshToken,
                     HttpServletResponse response) {
    authService.logout(refreshToken);
    response.addHeader(HttpHeaders.SET_COOKIE, clearRefreshCookie().toString());
  }

  private ResponseCookie refreshCookie(String value) {
    return ResponseCookie.from("refresh_token", value)
        .httpOnly(true)
        .secure(refreshCookieSecure)
        .sameSite(refreshCookieSameSite)
        .path("/api/auth")
        .maxAge(7 * 24 * 60 * 60L)
        .build();
  }

  private ResponseCookie clearRefreshCookie() {
    return ResponseCookie.from("refresh_token", "")
        .httpOnly(true)
        .secure(refreshCookieSecure)
        .sameSite(refreshCookieSameSite)
        .path("/api/auth")
        .maxAge(0)
        .build();
  }
}

