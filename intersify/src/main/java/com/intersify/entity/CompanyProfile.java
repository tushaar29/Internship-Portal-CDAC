package com.intersify.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.intersify.enums.CompanyStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "company_profile")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class CompanyProfile {

    @Id
    private Long companyId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "company_id")
    @JsonIgnore
    private User user;

    private String companyName;
    private String industry;
    private String website;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    private String headquarters;
    private String founded;
    private String companySize;
    private String phone;
    private String email; // Usually company contact email
    private String logo;

    @Enumerated(EnumType.STRING)
    private CompanyStatus status = CompanyStatus.PENDING;

    // ================= RELATIONSHIPS =================

    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Internship> internships;
}


