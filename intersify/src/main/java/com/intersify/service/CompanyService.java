package com.intersify.service;


import com.intersify.entity.CompanyProfile;
import com.intersify.enums.CompanyStatus;

import java.util.List;

public interface CompanyService {

    CompanyProfile getCompany(Long companyId);

    List<CompanyProfile> getCompaniesByStatus(CompanyStatus status);

    CompanyProfile updateCompanyProfile(Long companyId, CompanyProfile updatedProfile);

    void updateLogo(Long companyId, String logoUrl);

    CompanyProfile updateStatus(Long companyId, CompanyStatus status);
    
    List<CompanyProfile> getAllCompanies();
}

