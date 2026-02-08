package com.intersify.security;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.intersify.entity.User;
import com.intersify.repository.UserRepository;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Map;

import org.springframework.security.core.Authentication;

@Component
@RequiredArgsConstructor
public class JwtUtils {

    private final UserRepository userRepository;

    @Value("${jwt.secret.key}")
    private String secretKey;

    @Value("${jwt.expiration.time}")
    private long expirationTime;

    private SecretKey key;

    @PostConstruct
    public void init() {
        key = Keys.hmacShaKeyFor(secretKey.getBytes());
    }

    /* ======================================================
       ✅ PRIMARY METHOD — USED BY OAUTH & INTERNAL CALLS
       ====================================================== */
    public String generateToken(User user) {

        Date now = new Date();
        Date expiry = new Date(now.getTime() + expirationTime);

        return Jwts.builder()
                .subject(user.getEmail())
                .issuedAt(now)
                .expiration(expiry)
                .claims(Map.of(
                        "userId", user.getUserId(),
                        "role", user.getRole().name()
                ))
                .signWith(key)
                .compact();
    }

    /* ======================================================
       OPTIONAL — USED BY LOCAL LOGIN (Auth-based)
       ====================================================== */
    public String generateToken(Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return generateToken(user);
    }

    /* ======================================================
       TOKEN VALIDATION
       ====================================================== */
    public Claims validateToken(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
