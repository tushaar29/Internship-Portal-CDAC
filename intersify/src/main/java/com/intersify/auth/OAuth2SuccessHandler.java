package com.intersify.auth;

import java.io.IOException;
import java.util.Optional;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.intersify.entity.StudentProfile;
import com.intersify.entity.User;
import com.intersify.enums.AuthProvider;
import com.intersify.enums.Role;
import com.intersify.repository.StudentProfileRepository;
import com.intersify.repository.UserRepository;
import com.intersify.security.JwtUtils;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;



@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final JwtUtils jwtUtils;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException, ServletException {

        /* 1️⃣ Validate authentication type */
        if (!(authentication instanceof OAuth2AuthenticationToken oauthToken)) {
            response.sendRedirect(
                "http://localhost:5173/login?error=oauth_invalid"
            );
            return;
        }

        OAuth2User oauthUser = oauthToken.getPrincipal();

        /* 2️⃣ Extract email safely */
        String email = oauthUser.getAttribute("email");
        if (email == null || email.isBlank()) {
            response.sendRedirect(
                "http://localhost:5173/login?error=email_not_found"
            );
            return;
        }

        /* 3️⃣ Detect provider (CORRECT WAY) */
        AuthProvider provider =
                AuthProvider.valueOf(
                        oauthToken.getAuthorizedClientRegistrationId().toUpperCase()
                );

        String providerId = oauthUser.getName();

        /* 4️⃣ Lookup user */
        Optional<User> existingUserOpt = userRepository.findByEmail(email);

        User user;

        if (existingUserOpt.isPresent()) {

            user = existingUserOpt.get();

            /* 🔐 EDGE CASE: Local account trying OAuth */
            if (user.getProvider() == AuthProvider.LOCAL) {
                response.sendRedirect(
                    "http://localhost:5173/login?error=use_local_login"
                );
                return;
            }

            /* 🔐 EDGE CASE: Provider mismatch (Google vs Facebook) */
            if (user.getProvider() != provider) {
                response.sendRedirect(
                    "http://localhost:5173/login?error=provider_mismatch"
                );
                return;
            }

        } else {

            /* 5️⃣ Create new OAuth user */
            user = new User();
            user.setEmail(email);
            user.setName(oauthUser.getAttribute("name"));
            user.setRole(Role.STUDENT);               // default role
            user.setProvider(provider);
            user.setProviderId(providerId);

            user = userRepository.save(user);

            // Create Student Profile
            StudentProfile profile = new StudentProfile();
            profile.setUser(user);
            studentProfileRepository.save(profile);
        }

        /* 6️⃣ Generate internal JWT */
        String jwt = jwtUtils.generateToken(user);

        /* 7️⃣ Redirect to frontend */
        response.sendRedirect(
                "http://localhost:5173/oauth-success?token=" + jwt
        );
    }
}

