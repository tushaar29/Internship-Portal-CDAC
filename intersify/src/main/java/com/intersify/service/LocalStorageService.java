package com.intersify.service;

import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
@ConditionalOnMissingBean(com.google.firebase.cloud.StorageClient.class)
public class LocalStorageService {

    public String uploadFile(MultipartFile file, String folder) throws IOException {
        System.err.println("Firebase Storage not configured - using dummy storage service");
        return "https://example.com/dummy-file-url";
    }

    public void deleteFile(String fileUrl) {
        System.err.println("Firebase Storage not configured - skipping file deletion");
    }

    public String getPublicUrl(String filePath) {
        return "https://example.com/dummy-file-url";
    }
}