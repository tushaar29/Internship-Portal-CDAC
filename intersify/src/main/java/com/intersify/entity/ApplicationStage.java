package com.intersify.entity;

import com.intersify.enums.ApplicationStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationStage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long stageId;

    @ManyToOne
    @JoinColumn(name = "application_id", nullable = false)
    private Application application;

    @Enumerated(EnumType.STRING)
    @Column(length = 50)
    private ApplicationStatus status;

    @Column(columnDefinition = "TEXT")
    private String notes;

    private LocalDateTime stageDate = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "updated_by")
    private User updatedBy;

    // Helper method to get formatted stage info
    public String getStageInfo() {
        return String.format("%s - %s", status, stageDate);
    }
}