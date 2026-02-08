package com.intersify.service;

import com.google.cloud.storage.Blob;
import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.google.firebase.cloud.StorageClient;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Service
public class FirebaseStorageService {

    @Value("${firebase.storage.bucket:}")
    private String bucketName;

    @Value("${firebase.storage.base-url:}")
    private String baseUrl;

    @Autowired(required = false)
    private StorageClient storageClient;

    public String uploadFile(MultipartFile file, String folder) throws IOException {
        // Check if Firebase is configured
        if (storageClient == null || bucketName.isEmpty() || baseUrl.isEmpty()) {
            System.err.println("Firebase Storage not configured - returning dummy URL");
            return "https://example.com/dummy-file-url";
        }
        
        // Generate unique filename
        String fileName = folder + "/" + UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        
        // Get storage instance
        Storage storage = storageClient.bucket().getStorage();
        
        // Create blob info
        BlobId blobId = BlobId.of(bucketName, fileName);
        BlobInfo blobInfo = BlobInfo.newBuilder(blobId)
                .setContentType(file.getContentType())
                .build();
        
        // Upload file
        Blob blob = storage.create(blobInfo, file.getBytes());
        
        // Return public URL
        return baseUrl + fileName;
    }

    public void deleteFile(String fileUrl) {
        if (fileUrl == null || fileUrl.isEmpty()) {
            return;
        }
        
        // Check if Firebase is configured
        if (storageClient == null || bucketName.isEmpty() || baseUrl.isEmpty()) {
            System.err.println("Firebase Storage not configured - skipping file deletion");
            return;
        }
        
        try {
            // Extract file path from URL
            String filePath = fileUrl.replace(baseUrl, "");
            
            Storage storage = storageClient.bucket().getStorage();
            BlobId blobId = BlobId.of(bucketName, filePath);
            storage.delete(blobId);
        } catch (Exception e) {
            System.err.println("Failed to delete file from Firebase: " + e.getMessage());
        }
    }

    public String getPublicUrl(String filePath) {
        // Check if Firebase is configured
        if (storageClient == null || bucketName.isEmpty() || baseUrl.isEmpty()) {
            return "https://example.com/dummy-file-url";
        }
        return baseUrl + filePath;
    }
}