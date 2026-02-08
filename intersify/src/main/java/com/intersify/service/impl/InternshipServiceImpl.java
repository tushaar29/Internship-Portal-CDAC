package com.intersify.service.impl;

import com.intersify.entity.CompanyProfile;
import com.intersify.entity.Internship;
import com.intersify.enums.CompanyStatus;
import com.intersify.repository.ApplicationRepository;
import com.intersify.repository.CompanyProfileRepository;
import com.intersify.repository.InternshipRepository;
import com.intersify.service.InternshipService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class InternshipServiceImpl implements InternshipService {

    private final InternshipRepository internshipRepo;
    private final CompanyProfileRepository companyRepo;
    private final ApplicationRepository applicationRepo;

    @Override
    public Internship createInternship(Long companyId, Internship internship) {

        CompanyProfile company = companyRepo.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        if (company.getStatus() != CompanyStatus.APPROVED) {
            throw new org.springframework.web.server.ResponseStatusException(
                HttpStatus.FORBIDDEN, "Your company profile must be APPROVED by an admin before posting."
            );
        }

        internship.setCompany(company);
        return internshipRepo.save(internship);
    }

    @Override
    public Internship getInternshipById(Long internshipId) {
        return internshipRepo.findById(internshipId)
                .orElseThrow(() -> new RuntimeException("Internship not found"));
    }

    @Override
    public Internship updateInternship(Long internshipId, Long companyId, Internship updatedInternship) {

        Internship internship = getInternshipById(internshipId);

        if (!internship.getCompany().getCompanyId().equals(companyId)) {
            throw new RuntimeException("Unauthorized to update this internship");
        }

        internship.setTitle(updatedInternship.getTitle());
        internship.setLocation(updatedInternship.getLocation());
        internship.setStipend(updatedInternship.getStipend());
        internship.setSkillsRequired(updatedInternship.getSkillsRequired());
        internship.setDuration(updatedInternship.getDuration());
        internship.setDeadline(updatedInternship.getDeadline());
        internship.setStatus(updatedInternship.getStatus());

        return internshipRepo.save(internship);
    }
    
    @Override
    public List<Internship> getInternshipsByCompany(Long companyId) {
        // 1. Fetch the list
        List<Internship> internships = internshipRepo.findByCompanyCompanyId(companyId);
        
        // 2. Map the counts (101% Accuracy Fix)
        for (Internship i : internships) {
            long count = applicationRepo.countByInternshipInternshipId(i.getInternshipId());
            i.setApplicantsCount(count);
        }
        
        return internships;
    }

    @Override
    public void deleteInternship(Long internshipId, Long companyId) {

        Internship internship = getInternshipById(internshipId);

        if (!internship.getCompany().getCompanyId().equals(companyId)) {
            throw new RuntimeException("Unauthorized to delete this internship");
        }

        internshipRepo.delete(internship);
    }

    @Override
    public List<Internship> getAllInternships() {
        return internshipRepo.findAll();
    }

    public List<Internship> getPublicInternships() {
        return internshipRepo.findAll(); // later add filters
    }


	@Override
	public void deleteInternship(Long id) {
		// TODO Auto-generated method stub
		internshipRepo.deleteById(id);
	}
}

