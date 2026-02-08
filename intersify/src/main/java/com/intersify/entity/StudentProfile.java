package com.intersify.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.*;

import java.util.List;

@Entity
@Table(name = "student_profile")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class StudentProfile {

    @Id
    private Long studentId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "student_id")
    private User user;

    private String education;
    private String skills;
    private String resumeUrl;
    private String profilePicUrl;
    private String bio;

    // ================= RELATIONSHIPS =================

    @OneToMany(mappedBy = "student")
    @JsonIgnore
    private List<Application> applications;

    @OneToMany(mappedBy = "student")
    @JsonIgnore
    private List<Certificate> certificates;
}


