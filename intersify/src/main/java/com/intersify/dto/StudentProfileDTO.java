package com.intersify.dto;

import lombok.Data;

@Data
public class StudentProfileDTO {
    private String fullName;
    private String email;
    private String education;
    private String skills;
    private String bio;
    private String resumeUrl;
}
