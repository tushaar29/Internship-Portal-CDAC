package com.intersify.controller;


import com.intersify.dto.ApiResponse;
import com.intersify.dto.JwtDTO;
import com.intersify.entity.StudentProfile;
import com.intersify.service.FileStorageService;
import com.intersify.service.FirebaseStorageService;
import com.intersify.service.StudentService;
import lombok.RequiredArgsConstructor;

import java.io.IOException;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/students")
@RequiredArgsConstructor
@PreAuthorize("hasRole('STUDENT')")
public class StudentController {

    private final StudentService studentService;
    private final FirebaseStorageService firebaseStorageService;

    // GET own profile
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(
            @AuthenticationPrincipal JwtDTO jwt) {

        return ResponseEntity.ok(
                studentService.getProfile(jwt.getUserId())
        );
    }
    
    
    @PostMapping("/profile/picture")
    public ResponseEntity<ApiResponse> uploadProfilePic(
            @AuthenticationPrincipal JwtDTO jwt,
            @RequestParam("image") MultipartFile file) throws IOException {

        // 1. Validate: Only images allowed
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            return ResponseEntity.badRequest().body(new ApiResponse("Only images (JPG, PNG) allowed", "ERROR"));
        }

        // 2. Store file in Firebase Cloud Storage
        String fileUrl = firebaseStorageService.uploadFile(file, "profile-pictures");

        // 3. Update Database
        studentService.updateProfilePic(jwt.getUserId(), fileUrl);

        return ResponseEntity.ok(new ApiResponse(fileUrl, "SUCCESS"));
    }
    
    
    @PostMapping("/profile/resume")
    public ResponseEntity<ApiResponse> uploadResume(
            @AuthenticationPrincipal JwtDTO jwt,
            @RequestParam("file") MultipartFile file) throws IOException {

        // Validate file type (Best Practice)
        if (!file.getContentType().equals("application/pdf")) {
            return ResponseEntity.badRequest().body(new ApiResponse("Only PDF allowed", "ERROR"));
        }

        String fileUrl = firebaseStorageService.uploadFile(file, "resumes");
        studentService.updateResumeUrl(jwt.getUserId(), fileUrl);

        return ResponseEntity.ok(new ApiResponse(fileUrl, "SUCCESS"));
    }

    // UPDATE own profile
    @PutMapping("/profile")
    public ResponseEntity<ApiResponse> updateProfile(
            @AuthenticationPrincipal JwtDTO jwt,
            @RequestBody StudentProfile profile) {

        studentService.updateProfile(jwt.getUserId(), profile);

        return ResponseEntity.ok(
                new ApiResponse("Student profile updated", "SUCCESS")
        );
    }
}

