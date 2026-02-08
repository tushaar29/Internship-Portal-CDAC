package com.intersify.service;


import com.intersify.entity.Internship;

import java.util.List;

public interface InternshipService {

    Internship createInternship(Long companyId, Internship internship);

    List<Internship> getAllInternships();
    
    List<Internship> getPublicInternships();

    List<Internship> getInternshipsByCompany(Long companyId);

    Internship getInternshipById(Long internshipId);

    Internship updateInternship(Long internshipId, Long companyId, Internship updatedInternship);

    void deleteInternship(Long internshipId, Long companyId);

	void deleteInternship(Long id);

}

