package com.intersify.controller;

import com.intersify.dto.ApiResponse;
import com.intersify.dto.JwtDTO;
import com.intersify.entity.CompanyProfile;
import com.intersify.enums.CompanyStatus;
import com.intersify.service.CompanyService;
import com.intersify.service.FirebaseStorageService;
import lombok.RequiredArgsConstructor;

import java.io.IOException;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/companies")
@RequiredArgsConstructor
@PreAuthorize("hasRole('COMPANY')")
public class CompanyController {
	
    private final CompanyService companyService;
    private final FirebaseStorageService firebaseStorageService;

    // GET own company profile
    @GetMapping("/profile")
    public ResponseEntity<CompanyProfile> getProfile(
            @AuthenticationPrincipal JwtDTO jwt) {

        return ResponseEntity.ok
        		(
                companyService.getCompany(jwt.getUserId()) 
        );
    }
    

    // UPDATE company profile
    @PutMapping("/profile")
    public ResponseEntity<ApiResponse> updateProfile(
            @AuthenticationPrincipal JwtDTO jwt,
            @RequestBody CompanyProfile profile) {

        companyService.updateCompanyProfile(jwt.getUserId(), profile);

        return ResponseEntity.ok(
                new ApiResponse("Company profile updated", "SUCCESS")
        );
    }

    @PostMapping("/profile/logo")
    public ResponseEntity<ApiResponse> uploadLogo(
            @AuthenticationPrincipal JwtDTO jwt,
            @RequestParam("image") MultipartFile file) throws IOException {

        // 1. Validate: Only images allowed
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            return ResponseEntity.badRequest().body(new ApiResponse("Only images (JPG, PNG) allowed", "ERROR"));
        }

        // 2. Store file in Firebase Cloud Storage
        String fileUrl = firebaseStorageService.uploadFile(file, "company-logos");

        // 3. Update Database
        companyService.updateLogo(jwt.getUserId(), fileUrl);

        return ResponseEntity.ok(new ApiResponse(fileUrl, "SUCCESS"));
    }
}

