package com.intersify.repository;

import com.intersify.entity.CompanyProfile;
import com.intersify.enums.CompanyStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CompanyProfileRepository extends JpaRepository<CompanyProfile, Long> {

    List<CompanyProfile> findByStatus(CompanyStatus status);
}

