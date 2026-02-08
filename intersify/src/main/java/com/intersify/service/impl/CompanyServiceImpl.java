package com.intersify.service.impl;

import com.intersify.entity.CompanyProfile;
import com.intersify.enums.CompanyStatus;
import com.intersify.repository.CompanyProfileRepository;
import com.intersify.service.CompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class CompanyServiceImpl implements CompanyService {

    private final CompanyProfileRepository companyRepo;

    @Override
    public CompanyProfile getCompany(Long companyId) {
        return companyRepo.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));
    }

    @Override
    public List<CompanyProfile> getCompaniesByStatus(CompanyStatus status) {
        return companyRepo.findByStatus(status);
    }

    @Override
    public CompanyProfile updateCompanyProfile(Long companyId, CompanyProfile updatedProfile) {

        CompanyProfile company = getCompany(companyId);

        company.setCompanyName(updatedProfile.getCompanyName());
        company.setIndustry(updatedProfile.getIndustry());
        company.setWebsite(updatedProfile.getWebsite());
        company.setDescription(updatedProfile.getDescription());
        company.setHeadquarters(updatedProfile.getHeadquarters());
        company.setFounded(updatedProfile.getFounded());
        company.setCompanySize(updatedProfile.getCompanySize());
        company.setPhone(updatedProfile.getPhone());
        company.setEmail(updatedProfile.getEmail());

        return companyRepo.save(company);
    }

    @Override
    public void updateLogo(Long companyId, String logoUrl) {
        CompanyProfile company = getCompany(companyId);
        company.setLogo(logoUrl);
        companyRepo.save(company);
    }
    
    @Override
    public List<CompanyProfile> getAllCompanies() {
        return companyRepo.findAll(); 
    }

    @Override
    public CompanyProfile updateStatus(Long companyId, CompanyStatus status) {
        CompanyProfile company = getCompany(companyId);
        company.setStatus(status);
        return companyRepo.save(company);
    }
}

