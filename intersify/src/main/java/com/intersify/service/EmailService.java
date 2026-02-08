package com.intersify.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {
    
    private final JavaMailSender mailSender;
    
    @Value("${spring.mail.username}")
    private String fromEmail;
    
    public void sendOTPEmail(String toEmail, String otpCode) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Your OTP Verification Code - Internsify");
            
            String htmlContent = buildOTPEmailTemplate(otpCode);
            helper.setText(htmlContent, true);
            
            mailSender.send(message);
            log.info("OTP email sent successfully to: {}", toEmail);
            
        } catch (MessagingException e) {
            log.error("Failed to send OTP email to: {}", toEmail, e);
            throw new RuntimeException("Failed to send OTP email", e);
        }
    }
    
    private String buildOTPEmailTemplate(String otpCode) {
        return "<html>\n" +
            "<body style=\"font-family: Arial, sans-serif; line-height: 1.6; color: #333;\">\n" +
            "    <div style=\"max-width: 600px; margin: 0 auto; padding: 20px;\">\n" +
            "        <h2 style=\"color: #4CAF50;\">Internsify - OTP Verification</h2>\n" +
            "        <p>Dear User,</p>\n" +
            "        <p>Your One-Time Password (OTP) for verification is:</p>\n" +
            "        <div style=\"background-color: #f4f4f4; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;\">\n" +
            "            <h1 style=\"color: #4CAF50; margin: 0; letter-spacing: 5px;\">" + otpCode + "</h1>\n" +
            "        </div>\n" +
            "        <p>This OTP is valid for 5 minutes. Please do not share this code with anyone.</p>\n" +
            "        <p>If you did not request this verification, please ignore this email.</p>\n" +
            "        <p>Best regards,<br>Internsify Team</p>\n" +
            "    </div>\n" +
            "</body>\n" +
            "</html>";
    }
}