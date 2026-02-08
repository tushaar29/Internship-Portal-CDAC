package com.intersify.controller;

import com.intersify.dto.OTPRequestDTO;
import com.intersify.dto.OTPVerificationDTO;
import com.intersify.service.OTPService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth/otp")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "OTP Verification", description = "Email OTP verification endpoints")
public class OTPController {
    
    private final OTPService otpService;
    
    @PostMapping("/send")
    @Operation(summary = "Send OTP to email", description = "Generate and send OTP to the provided email address")
    public ResponseEntity<Map<String, String>> sendOTP(@Valid @RequestBody OTPRequestDTO request) {
        log.info("OTP send request received for email: {}", request.getEmail());
        
        otpService.generateAndSendOTP(request);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "OTP sent successfully to your email");
        response.put("status", "success");
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/verify")
    @Operation(summary = "Verify OTP", description = "Verify the OTP code sent to the email")
    public ResponseEntity<Map<String, String>> verifyOTP(@Valid @RequestBody OTPVerificationDTO request) {
        log.info("OTP verification request received for email: {}", request.getEmail());
        
        boolean isValid = otpService.verifyOTP(request);
        
        Map<String, String> response = new HashMap<>();
        if (isValid) {
            response.put("message", "OTP verified successfully");
            response.put("status", "success");
            return ResponseEntity.ok(response);
        } else {
            response.put("message", "Invalid OTP");
            response.put("status", "error");
            return ResponseEntity.badRequest().body(response);
        }
    }
}