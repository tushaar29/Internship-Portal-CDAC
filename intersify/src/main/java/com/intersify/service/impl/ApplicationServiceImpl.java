package com.intersify.service.impl;

import com.intersify.dto.ApplicationDetailsDTO;
import com.intersify.dto.ApplicationTrackingDTO;
import com.intersify.entity.*;
import com.intersify.enums.ApplicationStatus;
import com.intersify.repository.*;
import com.intersify.service.ApplicationService;
import com.intersify.service.EmailNotificationService;
import com.intersify.service.WebSocketNotificationService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class ApplicationServiceImpl implements ApplicationService {

    private final ApplicationRepository appRepo;
    private final StudentProfileRepository studentRepo;
    private final InternshipRepository internshipRepo;
    private final ApplicationStageRepository stageRepo;
    private final UserRepository userRepo;
    private final EmailNotificationService emailService;
    private final WebSocketNotificationService websocketService;

    @Override
    public Application apply(Long studentId, Long internshipId, String resumeUrl) {

        StudentProfile student = studentRepo.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Internship internship = internshipRepo.findById(internshipId)
                .orElseThrow(() -> new RuntimeException("Internship not found"));

        if (appRepo.existsByStudentAndInternship(student, internship)) {
            throw new RuntimeException("Already applied to this internship");
        }

        Application app = new Application();
        app.setStudent(student);
        app.setInternship(internship);
        app.setResumeUrl(resumeUrl);
        app.setStatus(ApplicationStatus.APPLIED);

        Application savedApp = appRepo.save(app);
        
        // Create initial stage entry
        createApplicationStage(savedApp, ApplicationStatus.APPLIED, "Application submitted", student.getUser());
        
        try {
            // Send WebSocket notification
             websocketService.broadcastToCompany(
                internship.getCompany().getCompanyId(),
                "New application for " + internship.getTitle(),
                savedApp.getApplicationId().toString(),
                "APPLIED"
            );
        } catch (Exception e) {
            System.err.println("Failed to send notification: " + e.getMessage());
            // Consume error so transaction doesn't rollback
        }
        
        return savedApp;
    }
    
    @Override
    public Application updateStatus(Long applicationId, String status, Long companyId) {
        return updateStatusWithNotes(applicationId, status, null, companyId);
    }

    @Override
    public Application updateStatusWithNotes(Long applicationId, String status, String notes, Long companyId) {
        System.out.println("Updating status for app " + applicationId + " to: '" + status + "'");
        Application app = appRepo.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if (!app.getInternship().getCompany().getCompanyId().equals(companyId)) {
            throw new RuntimeException("Unauthorized to update application status");
        }

        ApplicationStatus newStatus;
        try {
            newStatus = ApplicationStatus.valueOf(status.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
             throw new RuntimeException("Invalid status provided: " + status);
        }
        
        ApplicationStatus oldStatus = app.getStatus();
        
        // Validate status transitions
        validateStatusTransition(oldStatus, newStatus);
        
        app.setStatus(newStatus);
        Application updatedApp = appRepo.save(app);
        
        // Create stage entry
        User companyUser = userRepo.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company user not found"));
        createApplicationStage(updatedApp, newStatus, notes, companyUser);
        
        // Send email notification to student
        String studentEmail = app.getStudent().getUser().getEmail();
        String studentName = app.getStudent().getUser().getName();
        String internshipTitle = app.getInternship().getTitle();
        String companyName = app.getInternship().getCompany().getCompanyName();
        
        try {
            emailService.sendApplicationStatusUpdateEmail(
                studentEmail, studentName, internshipTitle, companyName, newStatus, notes
            );
        } catch (Exception e) {
            System.err.println("Failed to send email notification: " + e.getMessage());
            // Consume error so transaction doesn't rollback
        }
        
        // Send WebSocket notifications
        websocketService.sendApplicationStatusUpdate(
            app.getStudent().getStudentId(), 
            "Your application status has been updated to " + newStatus, 
            applicationId.toString(), 
            newStatus.toString()
        );
        
        websocketService.broadcastToCompany(
            app.getInternship().getCompany().getCompanyId(),
            "Application " + applicationId + " status updated to " + newStatus,
            applicationId.toString(),
            newStatus.toString()
        );
        
        return updatedApp;
    }
    
    private void validateStatusTransition(ApplicationStatus oldStatus, ApplicationStatus newStatus) {
        // Define allowed transitions
        
        // Allow Admin/Company to jump to ACCEPTED or REJECTED from any state for flexibility
        if (newStatus == ApplicationStatus.REJECTED || newStatus == ApplicationStatus.WITHDRAWN) {
            return;
        }

        switch (oldStatus) {
            case APPLIED:
                if (newStatus != ApplicationStatus.SHORTLISTED && 
                    newStatus != ApplicationStatus.ACCEPTED) {
                    throw new RuntimeException("Invalid status transition from APPLIED to " + newStatus);
                }
                break;
            case SHORTLISTED:
                if (newStatus != ApplicationStatus.INTERVIEW_SCHEDULED && 
                    newStatus != ApplicationStatus.ACCEPTED) {
                    throw new RuntimeException("Invalid status transition from SHORTLISTED to " + newStatus);
                }
                break;
            case INTERVIEW_SCHEDULED:
                if (newStatus != ApplicationStatus.INTERVIEW_COMPLETED && 
                    newStatus != ApplicationStatus.ACCEPTED) {
                    throw new RuntimeException("Invalid status transition from INTERVIEW_SCHEDULED to " + newStatus);
                }
                break;
            case INTERVIEW_COMPLETED:
                if (newStatus != ApplicationStatus.OFFER_MADE && 
                    newStatus != ApplicationStatus.ACCEPTED) {
                    throw new RuntimeException("Invalid status transition from INTERVIEW_COMPLETED to " + newStatus);
                }
                break;
            case OFFER_MADE:
                if (newStatus != ApplicationStatus.ACCEPTED) {
                    throw new RuntimeException("Invalid status transition from OFFER_MADE to " + newStatus);
                }
                break;
            case ACCEPTED:
                if (newStatus != ApplicationStatus.COMPLETED) {
                    throw new RuntimeException("Cannot change status from ACCEPTED unless to COMPLETED");
                }
                break;
            case COMPLETED:
                throw new RuntimeException("Internship is already COMPLETED");
            case REJECTED:
            case WITHDRAWN:
                // Allow reactivating applications from REJECTED or WITHDRAWN state
                // Only prevent if moving to APPLIED (which doesn't make sense)
                if (newStatus == ApplicationStatus.APPLIED) {
                     throw new RuntimeException("Cannot move back to APPLIED from " + oldStatus);
                }
                break;
            default:
                throw new RuntimeException("Invalid current status: " + oldStatus);
        }
    }
    
    private void createApplicationStage(Application application, ApplicationStatus status, String notes, User updatedBy) {
        ApplicationStage stage = new ApplicationStage();
        stage.setApplication(application);
        stage.setStatus(status);
        stage.setNotes(notes);
        stage.setUpdatedBy(updatedBy);
        stageRepo.save(stage);
    }
    
    @Override
    public ApplicationTrackingDTO getApplicationTrackingDetails(Long applicationId, Long userId) {
        Application app = appRepo.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        
        // Verify user has access to this application
        boolean isStudent = app.getStudent().getStudentId().equals(userId);
        boolean isCompany = app.getInternship().getCompany().getCompanyId().equals(userId);
        
        if (!isStudent && !isCompany) {
            throw new RuntimeException("Unauthorized to view application details");
        }
        
        List<ApplicationStage> stageHistory = stageRepo.findByApplication_ApplicationIdOrderByStageDateDesc(applicationId);
        long totalStages = stageRepo.countByApplicationId(applicationId);
        
        ApplicationTrackingDTO dto = new ApplicationTrackingDTO();
        dto.setApplicationId(app.getApplicationId());
        dto.setStudentName(app.getStudent().getUser().getName());
        dto.setStudentEmail(app.getStudent().getUser().getEmail());
        dto.setInternshipTitle(app.getInternship().getTitle());
        dto.setCompanyName(app.getInternship().getCompany().getCompanyName());
        dto.setCurrentStatus(app.getStatus().toString());
        dto.setAppliedDate(app.getAppliedDate());
        dto.setResumeUrl(app.getResumeUrl());
        dto.setStageHistory(stageHistory);
        dto.setTotalStages(totalStages);
        dto.setNextAction(getNextAction(app.getStatus()));
        dto.setLastUpdated(stageHistory.isEmpty() ? app.getAppliedDate() : stageHistory.get(0).getStageDate());
        
        return dto;
    }
    
    @Override
    public List<ApplicationStage> getApplicationStageHistory(Long applicationId) {
        return stageRepo.findByApplication_ApplicationIdOrderByStageDateDesc(applicationId);
    }
    
    private String getNextAction(ApplicationStatus status) {
        switch (status) {
            case APPLIED:
                return "Waiting for company review";
            case SHORTLISTED:
                return "Prepare for potential interview";
            case INTERVIEW_SCHEDULED:
                return "Attend scheduled interview";
            case INTERVIEW_COMPLETED:
                return "Waiting for interview results";
            case OFFER_MADE:
                return "Review and respond to offer";
            case ACCEPTED:
                return "Congratulations! Prepare for onboarding";
            case REJECTED:
                return "Continue applying to other opportunities";
            case WITHDRAWN:
                return "Application withdrawn";
            default:
                return "Status unknown";
        }
    }

    @Override
    public ApplicationDetailsDTO getApplicationDetails(Long applicationId, Long companyUserId) {
        ApplicationDetailsDTO dto = appRepo.findApplicationDetails(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        return dto;
    }
    
    public boolean hasStudentApplied(Long studentId, Long internshipId) {
        StudentProfile student = studentRepo.findById(studentId).orElse(null);
        Internship internship = internshipRepo.findById(internshipId).orElse(null);
        
        if (student == null || internship == null) {
            return false;
        }
        
        return appRepo.existsByStudentAndInternship(student, internship);
    }

    @Override
    public List<Application> getApplicationsByStudent(Long studentId) {
        StudentProfile student = studentRepo.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return appRepo.findByStudent(student);
    }

    @Override
    public List<Application> getApplicationsByInternship(Long internshipId) {
        Internship internship = internshipRepo.findById(internshipId)
                .orElseThrow(() -> new RuntimeException("Internship not found"));
        return appRepo.findByInternship(internship);
    }

}

