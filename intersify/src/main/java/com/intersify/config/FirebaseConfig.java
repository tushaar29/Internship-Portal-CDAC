package com.intersify.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.StorageClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;
import java.io.FileInputStream;
import java.io.IOException;

@Configuration
public class FirebaseConfig {

    @Value("${firebase.storage.bucket}")
    private String bucketName;

    @Value("${firebase.service.account.path}")
    private String serviceAccountPath;

    @PostConstruct
    public void initializeFirebase() throws IOException {
        try {
            FileInputStream serviceAccount = new FileInputStream(serviceAccountPath);

            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .setStorageBucket(bucketName)
                    .build();

            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
            }
        } catch (Exception e) {
            System.err.println("Firebase initialization failed: " + e.getMessage());
            System.err.println("Continuing without Firebase services...");
        }
    }

    @Bean
    public StorageClient storageClient() {
        try {
            return FirebaseApp.getApps().isEmpty() ? null : StorageClient.getInstance();
        } catch (Exception e) {
            System.err.println("StorageClient initialization failed: " + e.getMessage());
            return null;
        }
    }
}