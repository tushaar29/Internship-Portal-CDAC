package com.intersify.controller;

import com.intersify.dto.ApiResponse;
import com.intersify.dto.JwtDTO;
import com.intersify.entity.Internship;
import com.intersify.service.InternshipService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/internships")
@RequiredArgsConstructor
public class InternshipController {

    private final InternshipService internshipService;

    // PUBLIC: view all internships
    @GetMapping("/public")
    public ResponseEntity<List<Internship>> getPublicInternships() {
        return ResponseEntity.ok(
            internshipService.getPublicInternships()
        );
    }
    
    @GetMapping("/company")
    @PreAuthorize("hasRole('COMPANY')")
    public ResponseEntity<List<Internship>> getCompanyInternships(
            @AuthenticationPrincipal JwtDTO jwt) {

        return ResponseEntity.ok(
            internshipService.getInternshipsByCompany(jwt.getUserId())
        );
    }

 // PUBLIC: get internship by id
    @GetMapping("/public/{id}")
    public ResponseEntity<Internship> getById(@PathVariable Long id) {
        return ResponseEntity.ok(
                internshipService.getInternshipById(id)
        );
    }


    // COMPANY: create internship
    @PostMapping
    @PreAuthorize("hasRole('COMPANY')")
    public ResponseEntity<ApiResponse> create(
            @AuthenticationPrincipal JwtDTO jwt,
            @RequestBody Internship internship) {

        internshipService.createInternship(jwt.getUserId(), internship);

        return ResponseEntity.ok(
                new ApiResponse("Internship created", "SUCCESS")
        );
    }

    // COMPANY: update internship
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('COMPANY')")
    public ResponseEntity<ApiResponse> update(
            @AuthenticationPrincipal JwtDTO jwt,
            @PathVariable Long id,
            @RequestBody Internship internship) {

        internshipService.updateInternship(id, jwt.getUserId(), internship);

        return ResponseEntity.ok(new ApiResponse("Internship updated", "SUCCESS"));
    }


    // COMPANY: delete internship
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('COMPANY')")
    public ResponseEntity<ApiResponse> delete(
            @AuthenticationPrincipal JwtDTO jwt,
            @PathVariable Long id) {

        internshipService.deleteInternship(id, jwt.getUserId());

        return ResponseEntity.ok(
                new ApiResponse("Internship deleted", "SUCCESS")
        );
    }
}

