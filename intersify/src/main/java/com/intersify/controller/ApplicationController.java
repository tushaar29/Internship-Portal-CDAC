package com.intersify.controller;

import com.intersify.dto.ApiResponse;
import com.intersify.dto.ApplicationDetailsDTO;
import com.intersify.dto.ApplicationTrackingDTO;
import com.intersify.dto.JwtDTO;
import com.intersify.entity.Application;
import com.intersify.entity.ApplicationStage;
import com.intersify.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    // STUDENT: apply
    @PostMapping("/{internshipId}/apply")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse> apply(
            @AuthenticationPrincipal JwtDTO jwt,
            @PathVariable Long internshipId,
            @RequestParam String resumeUrl) {

        applicationService.apply(jwt.getUserId(), internshipId, resumeUrl);

        return ResponseEntity.ok(
                new ApiResponse("Applied successfully", "SUCCESS")
        );
    }
    
    @GetMapping("/check/{internshipId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Map<String, Boolean>> checkApplicationStatus(
            @PathVariable Long internshipId,
            @AuthenticationPrincipal JwtDTO jwt) {

        boolean exists = applicationService.hasStudentApplied(jwt.getUserId(), internshipId);
        
        return ResponseEntity.ok(Map.of("isApplied", exists));
    }

    // STUDENT: view own applications
    @GetMapping("/student")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<Application>> studentApplications(
            @AuthenticationPrincipal JwtDTO jwt) {

        return ResponseEntity.ok(
                applicationService.getApplicationsByStudent(jwt.getUserId())
        );
    }

    // COMPANY: view applicants
    @GetMapping("/internship/{internshipId}")
    @PreAuthorize("hasRole('COMPANY')")
    public ResponseEntity<List<Application>> internshipApplications(
            @PathVariable Long internshipId) {

        return ResponseEntity.ok(
                applicationService.getApplicationsByInternship(internshipId)
        );
    }
    
    @GetMapping("/{applicationId}")
    @PreAuthorize("hasRole('COMPANY')")
    public ResponseEntity<ApplicationDetailsDTO> getApplicationDetails(
            @PathVariable Long applicationId,
            @AuthenticationPrincipal JwtDTO jwt
    ) {
        return ResponseEntity.ok(
                applicationService.getApplicationDetails(applicationId, jwt.getUserId())
        );
    }
    
    // COMPANY: get detailed application tracking info
    @GetMapping("/{applicationId}/tracking")
    @PreAuthorize("hasRole('COMPANY') or hasRole('STUDENT')")
    public ResponseEntity<ApplicationTrackingDTO> getApplicationTracking(
            @PathVariable Long applicationId,
            @AuthenticationPrincipal JwtDTO jwt) {
        return ResponseEntity.ok(
                applicationService.getApplicationTrackingDetails(applicationId, jwt.getUserId())
        );
    }
    
    // COMPANY: get application stage history
    @GetMapping("/{applicationId}/history")
    @PreAuthorize("hasRole('COMPANY') or hasRole('STUDENT')")
    public ResponseEntity<List<ApplicationStage>> getApplicationHistory(
            @PathVariable Long applicationId,
            @AuthenticationPrincipal JwtDTO jwt) {
        return ResponseEntity.ok(
                applicationService.getApplicationStageHistory(applicationId)
        );
    }

    // COMPANY: update status with notes
    @PutMapping("/{applicationId}/status")
    @PreAuthorize("hasRole('COMPANY')")
    public ResponseEntity<ApiResponse> updateStatus(
            @AuthenticationPrincipal JwtDTO jwt,
            @PathVariable Long applicationId,
            @RequestParam String status,
            @RequestParam(required = false) String notes) {

        applicationService.updateStatusWithNotes(applicationId, status, notes, jwt.getUserId());

        return ResponseEntity.ok(new ApiResponse("Application status updated successfully", "SUCCESS"));
    }
}


