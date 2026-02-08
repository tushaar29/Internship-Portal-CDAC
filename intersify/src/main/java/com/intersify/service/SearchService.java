package com.intersify.service;


import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.intersify.dto.SearchRequestDTO;
import com.intersify.dto.SearchResultDTO;
import com.intersify.entity.Internship;
import com.intersify.entity.StudentProfile;
import com.intersify.repository.InternshipRepository;
import com.intersify.repository.StudentProfileRepository;

import jakarta.persistence.criteria.Predicate;

@Service
public class SearchService {

    private final InternshipRepository internshipRepository;
    private final StudentProfileRepository studentRepository;

    public SearchService(InternshipRepository internshipRepository, StudentProfileRepository studentRepository) {
        this.internshipRepository = internshipRepository;
        this.studentRepository = studentRepository;
    }

    public SearchResultDTO searchInternships(SearchRequestDTO request) {
        Pageable pageable = PageRequest.of(request.getPage(), request.getSize());
        
        Specification<Internship> spec = (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            
            // Text search
            if (request.getKeyword() != null && !request.getKeyword().trim().isEmpty()) {
                String keyword = "%" + request.getKeyword().toLowerCase() + "%";
                Predicate titlePredicate = criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("title")), keyword
                );
                Predicate companyPredicate = criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("company").get("companyName")), keyword
                );
                Predicate locationPredicate = criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("location")), keyword
                );
                Predicate skillsPredicate = criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("skillsRequired")), keyword
                );
                
                predicates.add(criteriaBuilder.or(
                    titlePredicate, companyPredicate, locationPredicate, skillsPredicate
                ));
            }
            
            // Location filter
            if (request.getLocation() != null && !request.getLocation().isEmpty()) {
                Predicate locationPredicate = criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("location")), 
                    "%" + request.getLocation().toLowerCase() + "%"
                );
                predicates.add(locationPredicate);
            }
            
            // Skills filter
            if (request.getSkills() != null && !request.getSkills().isEmpty()) {
                String[] skills = request.getSkills().split(",");
                for (String skill : skills) {
                    skill = skill.trim();
                    if (!skill.isEmpty()) {
                        Predicate skillPredicate = criteriaBuilder.like(
                            criteriaBuilder.lower(root.get("skillsRequired")), 
                            "%" + skill.toLowerCase() + "%"
                        );
                        predicates.add(skillPredicate);
                    }
                }
            }
            
            // Stipend range
            if (request.getMinStipend() != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(
                    root.get("stipend"), request.getMinStipend()
                ));
            }
            
            if (request.getMaxStipend() != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(
                    root.get("stipend"), request.getMaxStipend()
                ));
            }
            
            // Duration filter
            if (request.getDuration() != null && !request.getDuration().isEmpty()) {
                Predicate durationPredicate = criteriaBuilder.equal(
                    root.get("duration"), request.getDuration()
                );
                predicates.add(durationPredicate);
            }
            
            // Deadline filter (only active internships)
            if (request.getActiveOnly() != null && request.getActiveOnly()) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(
                    root.get("deadline"), java.time.LocalDate.now()
                ));
            }
            
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
        
        Page<Internship> page = internshipRepository.findAll(spec, pageable);
        
        return SearchResultDTO.builder()
            .internships(page.getContent())
            .totalElements(page.getTotalElements())
            .totalPages(page.getTotalPages())
            .currentPage(page.getNumber())
            .hasNext(page.hasNext())
            .hasPrevious(page.hasPrevious())
            .build();
    }

    public List<Internship> getRecommendedInternships(Long studentId) {
        StudentProfile student = studentRepository.findById(studentId)
            .orElseThrow(() -> new RuntimeException("Student not found"));
        
        // Get student's skills
        String studentSkills = student.getSkills() != null ? student.getSkills() : "";
        
        // Create recommendation based on skills match
        Specification<Internship> recommendationSpec = (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            
            // Only active internships
            predicates.add(criteriaBuilder.greaterThanOrEqualTo(
                root.get("deadline"), java.time.LocalDate.now()
            ));
            
            // Skills-based recommendation
            if (!studentSkills.isEmpty()) {
                String[] skills = studentSkills.toLowerCase().split(",");
                for (String skill : skills) {
                    skill = skill.trim();
                    if (!skill.isEmpty()) {
                        Predicate skillPredicate = criteriaBuilder.like(
                            criteriaBuilder.lower(root.get("skillsRequired")), 
                            "%" + skill + "%"
                        );
                        predicates.add(skillPredicate);
                    }
                }
            }
            
            // Location-based preference (removed as StudentProfile doesn't have location field)
            
            return criteriaBuilder.or(predicates.toArray(new Predicate[0]));
        };
        
        List<Internship> recommendations = internshipRepository.findAll(recommendationSpec);
        
        // Sort by relevance (number of matching skills)
        return recommendations.stream()
            .sorted((i1, i2) -> {
                int match1 = countSkillMatches(i1.getSkillsRequired(), studentSkills);
                int match2 = countSkillMatches(i2.getSkillsRequired(), studentSkills);
                return Integer.compare(match2, match1); // Descending order
            })
            .limit(10)
            .collect(Collectors.toList());
    }

    private int countSkillMatches(String internshipSkills, String studentSkills) {
        if (internshipSkills == null || studentSkills == null) return 0;
        
        String[] studentSkillArray = studentSkills.toLowerCase().split(",");
        String[] internshipSkillArray = internshipSkills.toLowerCase().split(",");
        
        int matches = 0;
        for (String studentSkill : studentSkillArray) {
            studentSkill = studentSkill.trim();
            for (String internshipSkill : internshipSkillArray) {
                internshipSkill = internshipSkill.trim();
                if (studentSkill.equals(internshipSkill)) {
                    matches++;
                }
            }
        }
        return matches;
    }

    public List<String> getPopularSkills() {
        return internshipRepository.findAll().stream()
            .map(Internship::getSkillsRequired)
            .filter(skills -> skills != null && !skills.isEmpty())
            .flatMap(skills -> List.of(skills.split(",")).stream())
            .map(String::trim)
            .map(String::toLowerCase)
            .collect(Collectors.groupingBy(skill -> skill, Collectors.counting()))
            .entrySet().stream()
            .sorted((e1, e2) -> Long.compare(e2.getValue(), e1.getValue()))
            .limit(20)
            .map(Map.Entry::getKey)
            .collect(Collectors.toList());
    }

    public List<String> getPopularLocations() {
        return internshipRepository.findAll().stream()
            .map(Internship::getLocation)
            .filter(location -> location != null && !location.isEmpty())
            .map(String::toLowerCase)
            .collect(Collectors.groupingBy(location -> location, Collectors.counting()))
            .entrySet().stream()
            .sorted((e1, e2) -> Long.compare(e2.getValue(), e1.getValue()))
            .limit(15)
            .map(Map.Entry::getKey)
            .collect(Collectors.toList());
    }

    public List<String> getPopularCompanies() {
        return internshipRepository.findAll().stream()
            .map(internship -> internship.getCompany().getCompanyName())
            .filter(company -> company != null && !company.isEmpty())
            .map(String::toLowerCase)
            .collect(Collectors.groupingBy(company -> company, Collectors.counting()))
            .entrySet().stream()
            .sorted((e1, e2) -> Long.compare(e2.getValue(), e1.getValue()))
            .limit(20)
            .map(Map.Entry::getKey)
            .collect(Collectors.toList());
    }

    public long getTotalInternships() {
        return internshipRepository.count();
    }

    public long getActiveInternships() {
        return internshipRepository.findAll().stream()
            .filter(internship -> internship.getDeadline() != null 
                && internship.getDeadline().isAfter(java.time.LocalDate.now()))
            .count();
    }

    public long getTotalCompanies() {
        return internshipRepository.findAll().stream()
            .map(internship -> internship.getCompany().getCompanyId())
            .distinct()
            .count();
    }

    public long getTotalApplications() {
        // This would need ApplicationRepository to be properly implemented
        // For now, return 0 as placeholder
        return 0;
    }
}