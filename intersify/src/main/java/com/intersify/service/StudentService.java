package com.intersify.service;

import com.intersify.dto.StudentProfileDTO;
import com.intersify.entity.StudentProfile;

public interface StudentService {

    StudentProfileDTO getProfile(Long studentId);

    void updateProfile(Long studentId, StudentProfile updatedProfile);

	void updateResumeUrl(Long userId, String fileName);

	void updateProfilePic(Long userId, String fileName);

    java.util.List<StudentProfile> getAllStudents();
}
