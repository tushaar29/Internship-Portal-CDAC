package com.intersify.repository;
import com.intersify.dto.ApplicationDetailsDTO;
import com.intersify.entity.Application;
import com.intersify.entity.Internship;
import com.intersify.entity.StudentProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

    List<Application> findByStudent(StudentProfile student);

    List<Application> findByInternship(Internship internship);

    boolean existsByStudentAndInternship(StudentProfile student, Internship internship);
    
    boolean existsByStudentStudentIdAndInternshipInternshipId(Long studentId, Long internshipId);
    
    long countByInternshipInternshipId(Long internshipId);
    
    @Query("SELECT a FROM Application a JOIN FETCH a.internship i JOIN FETCH i.company c WHERE a.student.id = :studentId")
    List<Application> findByStudentIdWithCompany(@Param("studentId") Long studentId);
    
    @Query("SELECT new com.intersify.dto.ApplicationDetailsDTO(" +
    	       "a.applicationId, " +
    	       "CAST(a.status as string), " + 
    	       "sp.resumeUrl, " +
    	       "u.name, " + 
    	       "u.email, " + 
    	       "sp.bio) " +
    	       "FROM Application a " +
    	       "JOIN a.student sp " + 
    	       "JOIN sp.user u " +    
    	       "WHERE a.applicationId = :appId")
    	Optional<ApplicationDetailsDTO> findApplicationDetails(@Param("appId") Long appId);
}

