package com.intersify.repository;

import com.intersify.entity.EmailVerificationOTP;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface EmailVerificationOTPRepository extends JpaRepository<EmailVerificationOTP, Long> {
    
    Optional<EmailVerificationOTP> findByEmail(String email);
    
    Optional<EmailVerificationOTP> findByEmailAndOtpCode(String email, String otpCode);
    
    List<EmailVerificationOTP> findByEmailAndCreatedAtAfter(String email, LocalDateTime since);
    
    @Query("SELECT COUNT(e) FROM EmailVerificationOTP e WHERE e.email = ?1 AND e.createdAt >= ?2")
    long countByEmailAndCreatedAtAfter(String email, LocalDateTime since);
    
    void deleteByEmail(String email);
    
    void deleteByExpiresAtBefore(LocalDateTime now);
}