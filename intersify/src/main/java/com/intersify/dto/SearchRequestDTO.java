package com.intersify.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SearchRequestDTO {
    
    private String keyword;
    private String location;
    private String skills;
    private String minStipend;
    private String maxStipend;
    private String duration;
    private Boolean activeOnly;
    private String companyName;
    private String industry;
    
    private int page = 0;
    private int size = 10;
    
    private String sortBy = "deadline";
    private String sortDirection = "ASC";
}