package com.intersify.controller;

import com.intersify.dto.ApiResponse;
import com.intersify.entity.CompanyProfile;
import com.intersify.entity.StudentProfile;
import com.intersify.entity.Internship;
import com.intersify.enums.CompanyStatus;
import com.intersify.service.CompanyService;
import com.intersify.service.InternshipService;
import com.intersify.service.StudentService;
import com.intersify.service.UserService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final CompanyService companyService;
    private final InternshipService internshipService; 
    private final StudentService studentService;
    private final UserService userService;
    
    // --- COMPANY MANAGEMENT ---
    @GetMapping("/companies")
    public ResponseEntity<List<CompanyProfile>> getCompanies(
            @RequestParam(required = false) String status) {
        
        // 1. If no status provided, return all
        if (status == null || status.isEmpty()) {
            return ResponseEntity.ok(companyService.getAllCompanies());
        }

        try {
            CompanyStatus companyStatus = CompanyStatus.valueOf(status.toUpperCase());
            return ResponseEntity.ok(companyService.getCompaniesByStatus(companyStatus));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/companies/{companyId}/status")
    public ResponseEntity<ApiResponse> updateCompanyStatus(
            @PathVariable Long companyId,
            @RequestParam CompanyStatus status) {
        companyService.updateStatus(companyId, status);
        return ResponseEntity.ok(new ApiResponse("Company status updated", "SUCCESS"));
    }

    @GetMapping("/companies/{companyId}")
    public ResponseEntity<CompanyProfile> getCompany(@PathVariable Long companyId) {
        return ResponseEntity.ok(companyService.getCompany(companyId));
    }

    @GetMapping("/companies/{companyId}/internships")
    public ResponseEntity<List<Internship>> getCompanyInternships(@PathVariable Long companyId) {
        return ResponseEntity.ok(internshipService.getInternshipsByCompany(companyId));
    }

    // --- INTERNSHIP MODERATION ---
    @GetMapping("/internships")
    public ResponseEntity<?> getAllInternships() {
        return ResponseEntity.ok(internshipService.getAllInternships());
    }

    @DeleteMapping("/internships/{id}")
    public ResponseEntity<ApiResponse> removeInternship(@PathVariable Long id) {
        // Admin can delete any internship if it's fake/scam
        internshipService.deleteInternship(id);
        return ResponseEntity.ok(new ApiResponse("Internship removed by admin", "SUCCESS"));
    }

    // --- STUDENT MANAGEMENT ---
    @GetMapping("/students")
    public ResponseEntity<List<StudentProfile>> getAllStudents() {
        return ResponseEntity.ok(studentService.getAllStudents());
    }

    // --- USER MANAGEMENT (Delete Company/Student) ---
    @DeleteMapping("/users/{userId}")
    public ResponseEntity<ApiResponse> deleteUser(@PathVariable Long userId) {
        userService.deleteUser(userId);
        return ResponseEntity.ok(new ApiResponse("User deleted successfully", "SUCCESS"));
    }
}

