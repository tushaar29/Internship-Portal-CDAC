package com.intersify.security;

import com.intersify.dto.JwtDTO;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class CustomJwtFilter extends OncePerRequestFilter {

    private final JwtUtils jwtUtils;
    
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        log.debug("Checking if should filter path: {}", path);
        boolean shouldSkip = path.startsWith("/oauth2/")
            || path.startsWith("/login/oauth2/")
            || path.startsWith("/auth/otp/");
        log.debug("Should skip filtering: {}", shouldSkip);
        return shouldSkip;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        log.debug("Processing request to: {}", request.getRequestURI());
        
        String header = request.getHeader("Authorization");
        log.debug("Authorization header: {}", header != null ? "present" : "absent");

        if (header != null && header.startsWith("Bearer ")) {

            String token = header.substring(7);
            log.debug("Extracted JWT token");
            
            try {
                Claims claims = jwtUtils.validateToken(token);
                log.debug("JWT token validated successfully");

                Long userId = claims.get("userId", Long.class);
                String email = claims.getSubject();
                String role = claims.get("role", String.class);

                JwtDTO jwtDTO = new JwtDTO(userId, email, role);

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                jwtDTO,
                                null,
                                List.of(new SimpleGrantedAuthority("ROLE_" + role))
                        );

                SecurityContextHolder.getContext()
                        .setAuthentication(authentication);
                log.debug("Authentication set in security context");
            } catch (Exception e) {
                log.error("JWT validation failed: {}", e.getMessage());
            }
        }

        filterChain.doFilter(request, response);
    }
}