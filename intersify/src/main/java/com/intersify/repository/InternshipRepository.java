package com.intersify.repository;


import com.intersify.entity.Internship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface InternshipRepository extends JpaRepository<Internship, Long>, JpaSpecificationExecutor<Internship> {

    List<Internship> findByCompanyCompanyId(Long companyId);

    List<Internship> findByTitleContainingIgnoreCase(String keyword);
    
}

