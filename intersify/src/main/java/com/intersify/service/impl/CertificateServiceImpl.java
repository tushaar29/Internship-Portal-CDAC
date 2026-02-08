package com.intersify.service.impl;

import com.intersify.dto.CertificateDTO;
import com.intersify.entity.Application;
import com.intersify.entity.Certificate;
import com.intersify.enums.ApplicationStatus;
import com.intersify.repository.ApplicationRepository;
import com.intersify.repository.CertificateRepository;
import com.intersify.service.CertificateService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.intersify.service.FileStorageService;
import com.intersify.service.PdfService;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class CertificateServiceImpl implements CertificateService {

    private final CertificateRepository certificateRepo;
    private final ApplicationRepository applicationRepo;
    private final PdfService pdfService;
    private final FileStorageService fileStorageService;

    @Override
    public CertificateDTO issueCertificate(Long applicationId, Long companyId) {
        Application app = applicationRepo.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if (!app.getInternship().getCompany().getCompanyId().equals(companyId)) {
            throw new RuntimeException("Unauthorized to issue certificate for this application.");
        }

        if (app.getStatus() != ApplicationStatus.COMPLETED) {
            throw new RuntimeException("Cannot issue certificate. Internship is not completed.");
        }

        // Check if already issued
        List<Certificate> existing = certificateRepo.findByStudent(app.getStudent());
        boolean alreadyIssued = existing.stream()
                .anyMatch(c -> c.getInternship().getInternshipId().equals(app.getInternship().getInternshipId()));

        if (alreadyIssued) {
            throw new RuntimeException("Certificate already issued for this internship.");
        }

        Certificate cert = new Certificate();
        cert.setStudent(app.getStudent());
        cert.setInternship(app.getInternship());
        cert.setIssueDate(LocalDate.now());
        
        // Generate PDF
        try {
            byte[] pdfBytes = pdfService.generateCertificate(
                app.getStudent().getUser().getName(), 
                app.getInternship().getTitle(), 
                app.getInternship().getCompany().getCompanyName(), 
                LocalDate.now()
            );
            
            String fileName = "certificate_" + app.getStudent().getStudentId() + "_" + app.getInternship().getInternshipId() + ".pdf";
            String fileUrl = fileStorageService.storeFile(pdfBytes, fileName);
            cert.setFileUrl(fileUrl);
            
        } catch (Exception e) {
            System.err.println("Failed to generate/upload certificate PDF: " + e.getMessage());
            // We can choose to fail or continue without file.
            // Let's fail so user can retry.
            throw new RuntimeException("Failed to generate certificate PDF", e);
        }
        
        Certificate saved = certificateRepo.save(cert);
        return mapToDTO(saved);
    }

    @Override
    public List<CertificateDTO> getCertificatesByStudent(Long studentId) {
        return certificateRepo.findByStudent_StudentId(studentId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public CertificateDTO getCertificateById(Long certificateId) {
        Certificate cert = certificateRepo.findById(certificateId)
                .orElseThrow(() -> new RuntimeException("Certificate not found"));
        return mapToDTO(cert);
    }

    private CertificateDTO mapToDTO(Certificate cert) {
        return new CertificateDTO(
                cert.getCertificateId(),
                cert.getStudent().getUser().getName(),
                cert.getInternship().getTitle(),
                cert.getInternship().getCompany().getCompanyName(),
                cert.getIssueDate(),
                cert.getFileUrl()
        );
    }
}
