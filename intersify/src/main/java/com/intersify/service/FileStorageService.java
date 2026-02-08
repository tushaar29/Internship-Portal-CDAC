package com.intersify.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import jakarta.annotation.PostConstruct;

import java.io.IOException;
import java.util.Map;

@Service
public class FileStorageService {

    @Value("${cloudinary.cloud-name:}")
    private String cloudName;

    @Value("${cloudinary.api-key:}")
    private String apiKey;

    @Value("${cloudinary.api-secret:}")
    private String apiSecret;

    private Cloudinary cloudinary;

    @PostConstruct
    public void init() {
        if (cloudName != null && !cloudName.isEmpty()) {
            cloudinary = new Cloudinary(ObjectUtils.asMap(
                    "cloud_name", cloudName,
                    "api_key", apiKey,
                    "api_secret", apiSecret));
        }
    }

    public String storeFile(MultipartFile file) throws IOException {
        if (cloudinary == null) {
             throw new IOException("Cloudinary not configured");
        }
        Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
        return (String) uploadResult.get("secure_url");
    }

    public String storeFile(byte[] fileBytes, String fileName) throws IOException {
        if (cloudinary == null) {
             throw new IOException("Cloudinary not configured");
        }
        
        String resourceType = "auto";
        if (fileName.toLowerCase().endsWith(".pdf")) {
            resourceType = "raw";
        }
        
        Map params = ObjectUtils.asMap(
            "public_id", fileName,
            "resource_type", resourceType
        );
        Map uploadResult = cloudinary.uploader().upload(fileBytes, params);
        return (String) uploadResult.get("secure_url");
    }

    public void deleteFile(String fileUrl) {
        if (cloudinary == null || fileUrl == null) return;
        try {
            // Extract publicId from URL (simplified)
            // Example: http://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg
            String[] parts = fileUrl.split("/");
            String fileName = parts[parts.length - 1];
            String publicId = fileName.substring(0, fileName.lastIndexOf('.'));
            
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        } catch (Exception e) {
             System.err.println("Failed to delete file from Cloudinary: " + e.getMessage());
        }
    }
}