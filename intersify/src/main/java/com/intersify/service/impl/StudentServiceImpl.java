package com.intersify.service.impl;

import com.intersify.dto.StudentProfileDTO;
import com.intersify.entity.StudentProfile;
import com.intersify.entity.User;
import com.intersify.repository.StudentProfileRepository;
import com.intersify.repository.UserRepository;
import com.intersify.service.FileStorageService;
import com.intersify.service.StudentService;
import lombok.RequiredArgsConstructor;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {

    private final StudentProfileRepository studentRepo;
    private final UserRepository userRepo;
    private final FileStorageService fileStorageService;

    @Override
    public List<StudentProfile> getAllStudents() {
        return studentRepo.findAll();
    }

    @Override
    public StudentProfileDTO getProfile(Long userId) {
        // Find the actual Entity or Create if missing (Lazy Creation)
        StudentProfile profile = studentRepo.findById(userId)
                .orElseGet(() -> {
                    User user = userRepo.findById(userId)
                            .orElseThrow(() -> new RuntimeException("User not found"));
                    
                    StudentProfile newProfile = new StudentProfile();
                    newProfile.setUser(user);
                    return studentRepo.save(newProfile);
                });
        
        StudentProfileDTO dto = new StudentProfileDTO();
        
        // Mapping Entity -> DTO
        dto.setFullName(profile.getUser().getName());
        dto.setEmail(profile.getUser().getEmail());
        dto.setEducation(profile.getEducation());
        dto.setSkills(profile.getSkills());
        dto.setBio(profile.getBio());
        dto.setResumeUrl(profile.getResumeUrl());
        
        return dto;
    }
    
    
    @Override
    public void updateProfilePic(Long userId, String fileName) {
        StudentProfile profile = studentRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        // Optional: Delete old profile pic from Cloudinary to save space
        String oldPic = profile.getProfilePicUrl();
        if (oldPic != null && !oldPic.isEmpty()) {
            fileStorageService.deleteFile(oldPic);
        }

        profile.setProfilePicUrl(fileName);
        studentRepo.save(profile);
    }

    @Override
    public void updateProfile(Long studentId, StudentProfile updatedProfile) {
        // 1. Fetch the actual Entity from DB (Not the DTO)
        StudentProfile student = studentRepo.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        // 2. Update ONLY the fields that should be editable
        student.setEducation(updatedProfile.getEducation());
        student.setSkills(updatedProfile.getSkills());
        student.setBio(updatedProfile.getBio());
        // Note: resumeUrl is usually updated via the specialized upload method

        // 3. Save the entity
        studentRepo.save(student);
    }

    @Override
    public void updateResumeUrl(Long userId, String fileName) {
        StudentProfile profile = studentRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        // Cleanup old file from Cloudinary to save server space
        String oldFileName = profile.getResumeUrl();
        if (oldFileName != null && !oldFileName.isEmpty() && !oldFileName.equals(fileName)) {
            fileStorageService.deleteFile(oldFileName);
        }

        profile.setResumeUrl(fileName);
        studentRepo.save(profile);
    }
}

