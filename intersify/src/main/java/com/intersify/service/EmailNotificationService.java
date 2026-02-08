package com.intersify.service;

import com.intersify.entity.User;
import com.intersify.enums.ApplicationStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailNotificationService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendApplicationStatusUpdateEmail(String toEmail, String studentName, 
            String internshipTitle, String companyName, ApplicationStatus newStatus, String notes) {
        
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Application Status Update - Intersify");
        
        String statusMessage = getStatusMessage(newStatus);
        String emailBody = String.format(
            "Dear %s,\n\n" +
            "Your application for the position of '%s' at %s has been updated.\n\n" +
            "New Status: %s\n" +
            "%s\n\n" +
            "%s\n\n" +
            "Best regards,\n" +
            "The Intersify Team",
            studentName, internshipTitle, companyName, newStatus, statusMessage, 
            notes != null ? "Notes: " + notes : ""
        );
        
        message.setText(emailBody);
        mailSender.send(message);
    }

    private String getStatusMessage(ApplicationStatus status) {
        switch (status) {
            case SHORTLISTED:
                return "Congratulations! Your application has been shortlisted for further review.";
            case INTERVIEW_SCHEDULED:
                return "Great news! An interview has been scheduled. Please check your dashboard for details.";
            case INTERVIEW_COMPLETED:
                return "Your interview has been completed. We will update you with the results soon.";
            case OFFER_MADE:
                return "Congratulations! You have received an offer for this position.";
            case ACCEPTED:
                return "Welcome to the team! Your application has been accepted.";
            case REJECTED:
                return "Thank you for your application. Unfortunately, we have decided to proceed with other candidates.";
            case WITHDRAWN:
                return "Your application has been withdrawn.";
            default:
                return "Your application is being reviewed.";
        }
    }

    @org.springframework.scheduling.annotation.Async
    public void sendInterviewReminderEmail(String toEmail, String studentName, 
            String internshipTitle, String companyName, String interviewDate, String interviewLocation) {
        
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Interview Reminder - Intersify");
        
        String emailBody = String.format(
            "Dear %s,\n\n" +
            "This is a reminder for your upcoming interview.\n\n" +
            "Position: %s\n" +
            "Company: %s\n" +
            "Date & Time: %s\n" +
            "Location: %s\n\n" +
            "Please be prepared and arrive on time.\n\n" +
            "Best regards,\n" +
            "The Intersify Team",
            studentName, internshipTitle, companyName, interviewDate, interviewLocation
        );
        
        message.setText(emailBody);
        mailSender.send(message);
    }
}