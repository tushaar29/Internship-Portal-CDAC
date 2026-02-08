package com.intersify.controller;

import com.intersify.dto.SearchRequestDTO;
import com.intersify.dto.SearchResultDTO;
import com.intersify.dto.JwtDTO;
import com.intersify.entity.Internship;
import com.intersify.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/search")
@RequiredArgsConstructor
public class SearchController {

    private final SearchService searchService;

    // Public search endpoint - no authentication required
    @PostMapping("/internships")
    public ResponseEntity<SearchResultDTO> searchInternships(@RequestBody SearchRequestDTO request) {
        SearchResultDTO result = searchService.searchInternships(request);
        return ResponseEntity.ok(result);
    }

    // Get recommended internships for logged-in students
    @GetMapping("/recommendations")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<Internship>> getRecommendations(@AuthenticationPrincipal JwtDTO jwt) {
        List<Internship> recommendations = searchService.getRecommendedInternships(jwt.getUserId());
        return ResponseEntity.ok(recommendations);
    }

    // Get popular skills
    @GetMapping("/popular-skills")
    public ResponseEntity<List<String>> getPopularSkills() {
        List<String> skills = searchService.getPopularSkills();
        return ResponseEntity.ok(skills);
    }

    // Get popular locations
    @GetMapping("/popular-locations")
    public ResponseEntity<List<String>> getPopularLocations() {
        List<String> locations = searchService.getPopularLocations();
        return ResponseEntity.ok(locations);
    }

    // Get popular companies
    @GetMapping("/popular-companies")
    public ResponseEntity<List<String>> getPopularCompanies() {
        List<String> companies = searchService.getPopularCompanies();
        return ResponseEntity.ok(companies);
    }

    // Quick search with keyword only
    @GetMapping("/quick")
    public ResponseEntity<SearchResultDTO> quickSearch(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        SearchRequestDTO request = SearchRequestDTO.builder()
                .keyword(keyword)
                .page(page)
                .size(size)
                .build();
        
        SearchResultDTO result = searchService.searchInternships(request);
        return ResponseEntity.ok(result);
    }

    // Advanced search with multiple filters
    @PostMapping("/advanced")
    public ResponseEntity<SearchResultDTO> advancedSearch(@RequestBody SearchRequestDTO request) {
        SearchResultDTO result = searchService.searchInternships(request);
        return ResponseEntity.ok(result);
    }

    // Get search statistics
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getSearchStats() {
        Map<String, Object> stats = Map.of(
            "totalInternships", searchService.getTotalInternships(),
            "activeInternships", searchService.getActiveInternships(),
            "totalCompanies", searchService.getTotalCompanies(),
            "totalApplications", searchService.getTotalApplications()
        );
        return ResponseEntity.ok(stats);
    }
}