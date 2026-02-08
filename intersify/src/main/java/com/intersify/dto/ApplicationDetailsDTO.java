package com.intersify.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor 
public class ApplicationDetailsDTO {
    private Long applicationId;
    private String status;
    private String resumeUrl;
    private String studentName; // Will map to u.name
    private String studentEmail; // Will map to u.email
    private String studentBio;   // Will map to sp.bio
}