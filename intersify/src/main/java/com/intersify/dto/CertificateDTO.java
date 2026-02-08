package com.intersify.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CertificateDTO {
    private Long certificateId;
    private String studentName;
    private String internshipTitle;
    private String companyName;
    private LocalDate issueDate;
    private String fileUrl;
}
