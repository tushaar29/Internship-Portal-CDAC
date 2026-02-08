package com.intersify.repository;

import com.intersify.entity.ApplicationStage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ApplicationStageRepository extends JpaRepository<ApplicationStage, Long> {
    
    List<ApplicationStage> findByApplication_ApplicationIdOrderByStageDateDesc(Long applicationId);
    
    @Query("SELECT COUNT(s) FROM ApplicationStage s WHERE s.application.applicationId = :applicationId")
    long countByApplicationId(@Param("applicationId") Long applicationId);
}