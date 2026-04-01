package com.autonest.security;

import com.autonest.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JwtUtil {
  private final SecretKey key;
  private final long accessTokenTtlSeconds;

  public JwtUtil(
      @Value("${autonest.jwt.secret:dev-secret-change-me-dev-secret-change-me}") String secret,
      @Value("${autonest.jwt.access-ttl-seconds:900}") long accessTokenTtlSeconds
  ) {
    this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    this.accessTokenTtlSeconds = accessTokenTtlSeconds;
  }

  public long getAccessTokenTtlSeconds() {
    return accessTokenTtlSeconds;
  }

  public String createAccessToken(User user) {
    Instant now = Instant.now();
    Instant exp = now.plusSeconds(accessTokenTtlSeconds);
    return Jwts.builder()
        .subject(Long.toString(user.getId()))
        .issuedAt(Date.from(now))
        .expiration(Date.from(exp))
        .claim("email", user.getEmail())
        .claim("role", user.getRole().name())
        .signWith(key)
        .compact();
  }

  public Claims parseClaims(String token) {
    return Jwts.parser()
        .verifyWith(key)
        .build()
        .parseSignedClaims(token)
        .getPayload();
  }
}

