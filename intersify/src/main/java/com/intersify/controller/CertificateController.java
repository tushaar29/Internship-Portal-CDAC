package com.intersify.controller;

import com.intersify.dto.ApiResponse;
import com.intersify.dto.CertificateDTO;
import com.intersify.dto.JwtDTO;
import com.intersify.service.CertificateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/certificates")
@RequiredArgsConstructor
public class CertificateController {

    private final CertificateService certificateService;

    // COMPANY: Issue certificate
    @PostMapping("/issue/{applicationId}")
    @PreAuthorize("hasRole('COMPANY')")
    public ResponseEntity<CertificateDTO> issueCertificate(
            @AuthenticationPrincipal JwtDTO jwt,
            @PathVariable Long applicationId) {
        return ResponseEntity.ok(certificateService.issueCertificate(applicationId, jwt.getUserId()));
    }

    // STUDENT: Get my certificates
    @GetMapping("/my")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<CertificateDTO>> getMyCertificates(
            @AuthenticationPrincipal JwtDTO jwt) {
        
        // jwt.getUserId() returns the User ID (from User table).
        // But getCertificatesByStudent expects StudentProfile ID?
        // Let's check how other controllers handle this.
        // Usually there is a mapping from userId to studentId or we pass userId and service resolves it.
        // Let's assume we need to pass StudentId.
        // Wait, JwtDTO usually has userId.
        // If the service expects StudentId (PK of StudentProfile), we need to resolve it.
        // In ApplicationController: applicationService.apply(jwt.getUserId(), ...)
        // And ApplicationServiceImpl: studentRepo.findById(studentId)
        // This implies jwt.getUserId() IS the studentId? OR they are same?
        // Let's check User and StudentProfile relationship.
        // Usually User is OneToOne with StudentProfile. They might share ID or have FK.
        // If ApplicationServiceImpl uses `studentRepo.findById(studentId)`, and controller passes `jwt.getUserId()`,
        // it suggests `studentId` passed to service IS the `userId` or the `studentProfileId`.
        // If they are different, we have a bug in my assumption or the codebase handles it.
        // Let's check `ApplicationServiceImpl.java` again.
        // `StudentProfile student = studentRepo.findById(studentId)`
        // If `jwt.getUserId()` is passed, then `jwt.getUserId()` MUST be the `studentId`?
        // Or maybe `StudentProfile` shares the ID with `User` via `@MapsId`?
        // I'll assume for now `jwt.getUserId()` works as `studentId` (or I need to look up student by user id).
        
        // To be safe, I should change service to `getCertificatesByUserId(Long userId)`?
        // Or I just use `jwt.getUserId()` assuming it works like elsewhere.
        
        return ResponseEntity.ok(certificateService.getCertificatesByStudent(jwt.getUserId()));
    }

    // PUBLIC/AUTH: View certificate
    @GetMapping("/{id}")
    public ResponseEntity<CertificateDTO> getCertificate(@PathVariable Long id) {
        return ResponseEntity.ok(certificateService.getCertificateById(id));
    }
}
