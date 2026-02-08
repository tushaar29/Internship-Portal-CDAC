package com.intersify.controller;

import com.intersify.dto.ApiResponse;
import com.intersify.dto.AuthRequest;
import com.intersify.dto.AuthResponse;
import com.intersify.dto.OTPRequestDTO;
import com.intersify.dto.OTPVerificationDTO;
import com.intersify.dto.ResetPasswordRequest;
import com.intersify.dto.RegisterRequest;
import com.intersify.security.JwtUtils;
import com.intersify.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final AuthenticationManager authManager;
    private final JwtUtils jwtUtils;
    private final com.intersify.service.OTPService otpService;

    // ================= SIGNUP =================
    @PostMapping("/signup")
    public ResponseEntity<ApiResponse> register(
            @RequestBody @Valid RegisterRequest request) {

        if (!otpService.isEmailVerified(request.getEmail())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse("Email not verified. Please verify your email first.", "ERROR"));
        }

        userService.registerUser(
                request.getName(),
                request.getEmail(),
                request.getPassword(),
                request.getRole()
        );

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse("User registered successfully", "SUCCESS"));
    }

    // ================= SIGNIN =================
    @PostMapping("/signin")
    public ResponseEntity<AuthResponse> login(
            @RequestBody @Valid AuthRequest request) {

        Authentication authentication =
                authManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                request.getEmail(),
                                request.getPassword()
                        )
                );

        String jwt = jwtUtils.generateToken(authentication);

        return ResponseEntity.ok(
                new AuthResponse(jwt, "Login successful")
        );
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse> forgotPassword(@RequestBody OTPRequestDTO request) {
        if (!userService.existsByEmail(request.getEmail())) {
             return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse("User not found", "ERROR"));
        }
        otpService.generateAndSendOTP(request);
        return ResponseEntity.ok(new ApiResponse("OTP sent to your email", "SUCCESS"));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse> resetPassword(@RequestBody ResetPasswordRequest request) {
        // Verify OTP
        OTPVerificationDTO verifyDto = new OTPVerificationDTO();
        verifyDto.setEmail(request.getEmail());
        verifyDto.setOtpCode(request.getOtp());
        
        otpService.verifyOTP(verifyDto);
        
        // Update Password
        userService.updatePassword(request.getEmail(), request.getNewPassword());
        
        return ResponseEntity.ok(new ApiResponse("Password reset successfully", "SUCCESS"));
    }
}

