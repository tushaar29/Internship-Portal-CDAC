package com.intersify.config;

import com.intersify.service.OTPService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class OTPCleanupScheduler {
    
    private final OTPService otpService;
    
    // Run every hour to clean up expired OTPs
    @Scheduled(cron = "0 0 * * * *")
    public void cleanupExpiredOTPs() {
        log.info("Starting OTP cleanup task");
        try {
            otpService.cleanupExpiredOTPs();
            log.info("OTP cleanup completed successfully");
        } catch (Exception e) {
            log.error("Error during OTP cleanup", e);
        }
    }
}