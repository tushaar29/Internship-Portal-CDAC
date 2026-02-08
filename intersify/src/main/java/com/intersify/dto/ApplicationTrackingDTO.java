package com.intersify.dto;

import com.intersify.entity.ApplicationStage;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationTrackingDTO {
    private Long applicationId;
    private String studentName;
    private String studentEmail;
    private String internshipTitle;
    private String companyName;
    private String currentStatus;
    private LocalDateTime appliedDate;
    private String resumeUrl;
    private List<ApplicationStage> stageHistory;
    private Long totalStages;
    private String nextAction;
    private LocalDateTime lastUpdated;
}