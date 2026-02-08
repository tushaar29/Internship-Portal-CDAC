package com.intersify.service;

import com.intersify.dto.ApplicationDetailsDTO;
import com.intersify.dto.ApplicationTrackingDTO;
import com.intersify.entity.Application;
import com.intersify.entity.ApplicationStage;

import java.util.List;

public interface ApplicationService {

    Application apply(Long studentId, Long internshipId, String resumeUrl);

    List<Application> getApplicationsByStudent(Long studentId);

    List<Application> getApplicationsByInternship(Long internshipId);

    Application updateStatus(Long applicationId, String status, Long userId);

    Application updateStatusWithNotes(Long applicationId, String status, String notes, Long userId);

    boolean hasStudentApplied(Long userId, Long internshipId);

    ApplicationDetailsDTO getApplicationDetails(Long applicationId, Long companyUserId);

    ApplicationTrackingDTO getApplicationTrackingDetails(Long applicationId, Long userId);

    List<ApplicationStage> getApplicationStageHistory(Long applicationId);
}

