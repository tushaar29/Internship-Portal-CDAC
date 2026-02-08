package com.intersify.service.impl;

import com.intersify.entity.Notification;
import com.intersify.entity.User;
import com.intersify.repository.NotificationRepository;
import com.intersify.repository.UserRepository;
import com.intersify.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepo;
    private final UserRepository userRepo;

    @Override
    public void notifyUser(Long userId, String message) {

        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Notification notification = new Notification();
        notification.setUser(user);
        notification.setMessage(message);

        notificationRepo.save(notification);
    }
}

