package com.intersify.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class Internship {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long internshipId;

    @ManyToOne
    @JoinColumn(name = "company_id", nullable = false)
    @JsonIgnoreProperties({"internships", "applications", "password"})
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private CompanyProfile company;

    private String title;
    private String location;
    private String stipend;
    private String skillsRequired;
    private String duration;
    private LocalDate deadline;
 
    private String status = "active"; // Default to active

    @Transient // Use this if you want to calculate count on the fly
    private Long applicantsCount;

    // ================= RELATIONSHIPS =================

    @OneToMany(mappedBy = "internship")
    @JsonIgnore
    private List<Application> applications;

    @OneToMany(mappedBy = "internship")
    @JsonIgnore
    private List<Certificate> certificates;
}


