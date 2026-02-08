package com.intersify.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.intersify.enums.ApplicationStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import lombok.*;

@Entity
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long applicationId;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    @JsonIgnore
    private StudentProfile student;

    @ManyToOne
    @JoinColumn(name = "internship_id", nullable = false)
    
    private Internship internship;

    private String resumeUrl;

    @Enumerated(EnumType.STRING)
    @Column(length = 50)
    private ApplicationStatus status = ApplicationStatus.APPLIED;

    @com.fasterxml.jackson.annotation.JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime appliedDate = LocalDateTime.now();
}


