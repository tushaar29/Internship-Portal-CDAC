package com.intersify.service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.intersify.dto.OTPRequestDTO;
import com.intersify.dto.OTPVerificationDTO;
import com.intersify.entity.EmailVerificationOTP;
import com.intersify.exception.OTPException;
import com.intersify.repository.EmailVerificationOTPRepository;
import com.intersify.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class OTPService {
    
    private final EmailVerificationOTPRepository otpRepository;
    private final EmailService emailService;
    private final UserRepository userRepository;
    
    @Value("${otp.expiry.minutes:5}")
    private int otpExpiryMinutes;
    
    @Value("${otp.max.requests.per.hour:5}")
    private int maxRequestsPerHour;
    
    @Value("${otp.max.verification.attempts:3}")
    private int maxVerificationAttempts;
    
    private static final String OTP_CHARACTERS = "0123456789";
    private static final int OTP_LENGTH = 6;
    private final SecureRandom random = new SecureRandom();
    
    @Transactional
    public void generateAndSendOTP(OTPRequestDTO request) {
        String email = request.getEmail();
        
        // Check rate limiting
        checkRateLimit(email);
        
        // Generate OTP
        String otpCode = generateOTP();
        
        // Calculate expiry time
        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(otpExpiryMinutes);
        
        // Save or update OTP
        Optional<EmailVerificationOTP> existingOTP = otpRepository.findByEmail(email);
        
        if (existingOTP.isPresent()) {
            EmailVerificationOTP otp = existingOTP.get();
            otp.setOtpCode(otpCode);
            otp.setCreatedAt(LocalDateTime.now());
            otp.setExpiresAt(expiresAt);
            otp.setUsed(false);
            otp.setAttemptCount(0);
            otpRepository.save(otp);
        } else {
            EmailVerificationOTP newOTP = new EmailVerificationOTP();
            newOTP.setEmail(email);
            newOTP.setOtpCode(otpCode);
            newOTP.setExpiresAt(expiresAt);
            otpRepository.save(newOTP);
        }
        
        // Send email
        emailService.sendOTPEmail(email, otpCode);
        
        log.info("OTP generated and sent successfully for email: {}", email);
    }
    
    @Transactional
    public boolean verifyOTP(OTPVerificationDTO request) {
        String email = request.getEmail();
        String otpCode = request.getOtpCode();
        
        Optional<EmailVerificationOTP> otpOptional = otpRepository.findByEmailAndOtpCode(email, otpCode);
        
        if (otpOptional.isEmpty()) {
            log.warn("Invalid OTP verification attempt for email: {}", email);
            throw new OTPException("Invalid OTP code");
        }
        
        EmailVerificationOTP otp = otpOptional.get();
        
        // Check if OTP is expired
        if (otp.isExpired()) {
            log.warn("Expired OTP verification attempt for email: {}", email);
            throw new OTPException("OTP has expired");
        }
        
        // Check if OTP is already used
        if (otp.isUsed()) {
            log.warn("Used OTP verification attempt for email: {}", email);
            throw new OTPException("OTP has already been used");
        }
        
        // Check attempt count
        if (otp.getAttemptCount() >= maxVerificationAttempts) {
            log.warn("Maximum verification attempts exceeded for email: {}", email);
            throw new OTPException("Maximum verification attempts exceeded");
        }
        
        // Increment attempt count
        otp.incrementAttempt();
        otpRepository.save(otp);
        
        // Mark as used
        otp.setUsed(true);
        otpRepository.save(otp);
        
        log.info("OTP verified successfully for email: {}", email);
        return true;
    }
    
    @Transactional(readOnly = true)
    public boolean isEmailVerified(String email) {
        // Find latest OTP for this email
        Optional<EmailVerificationOTP> otpOptional = otpRepository.findByEmail(email);
        
        if (otpOptional.isEmpty()) {
            return false;
        }
        
        EmailVerificationOTP otp = otpOptional.get();
        
        // Check if it is used (verified)
        return otp.isUsed();
    }

    private void checkRateLimit(String email) {
        LocalDateTime oneHourAgo = LocalDateTime.now().minusHours(1);
        long requestCount = otpRepository.countByEmailAndCreatedAtAfter(email, oneHourAgo);
        
        if (requestCount >= maxRequestsPerHour) {
            log.warn("Rate limit exceeded for email: {} ({} requests in last hour)", email, requestCount);
            throw new OTPException("Rate limit exceeded. Please try again later.");
        }
    }
    
    private String generateOTP() {
        StringBuilder otp = new StringBuilder();
        for (int i = 0; i < OTP_LENGTH; i++) {
            otp.append(OTP_CHARACTERS.charAt(random.nextInt(OTP_CHARACTERS.length())));
        }
        return otp.toString();
    }
    
    @Transactional
    public void cleanupExpiredOTPs() {
        LocalDateTime now = LocalDateTime.now();
        otpRepository.deleteByExpiresAtBefore(now);
        log.info("Cleaned up expired OTPs");
    }
}