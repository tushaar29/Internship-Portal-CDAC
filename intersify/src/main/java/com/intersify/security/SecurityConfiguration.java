package com.intersify.security;

import com.intersify.auth.OAuth2SuccessHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfiguration {

    private final OAuth2SuccessHandler OAuth2SuccessHandler;

    private final CustomJwtFilter jwtFilter;


    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    	
    	http.cors(org.springframework.security.config.Customizer.withDefaults());

        http.csrf(csrf -> csrf.disable());
        
        http.headers(headers -> headers.frameOptions(frame -> frame.disable())
               
                .contentSecurityPolicy(csp -> csp
                    .policyDirectives("frame-ancestors 'self' http://localhost:5173 http://localhost:3000")
                )
            );

        http.sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        http.authorizeHttpRequests(auth -> auth
                .requestMatchers("/auth/**").permitAll()
                .requestMatchers("/auth/otp/**").permitAll()
                .requestMatchers("/internships/public/**" , "/oauth2/**" , "/login/oauth2/**").permitAll()
                .requestMatchers("/uploads/**").permitAll() 
                
                .anyRequest().authenticated());

        http.addFilterBefore(jwtFilter,
                UsernamePasswordAuthenticationFilter.class);

        http
        .oauth2Login(oauth -> oauth
            .successHandler(OAuth2SuccessHandler)
        );

        return http.build();
    }

    @Bean
    AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}

