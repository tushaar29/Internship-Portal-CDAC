package com.intersify.dto;

import com.intersify.entity.Internship;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SearchResultDTO {
    
    private List<Internship> internships;
    private long totalElements;
    private int totalPages;
    private int currentPage;
    private boolean hasNext;
    private boolean hasPrevious;
    
    private List<String> popularSkills;
    private List<String> popularLocations;
    private List<String> popularCompanies;
    
    private String searchQuery;
    private int executionTime; // in milliseconds
}