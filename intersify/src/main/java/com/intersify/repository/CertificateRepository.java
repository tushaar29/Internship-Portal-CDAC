package com.intersify.repository;

import com.intersify.entity.Certificate;
import com.intersify.entity.StudentProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CertificateRepository extends JpaRepository<Certificate, Long> {
    List<Certificate> findByStudent(StudentProfile student);
    List<Certificate> findByStudent_StudentId(Long studentId);
}

