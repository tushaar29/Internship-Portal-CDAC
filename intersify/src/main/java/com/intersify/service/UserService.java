package com.intersify.service;


import com.intersify.entity.User;
import com.intersify.enums.Role;

public interface UserService {

    User registerUser(String name, String email, String password, Role role);

    User loginUser(String email, String password);

    User updateUser(Long userId, String name, String email);

    void deleteUser(Long userId);

    User getUserById(Long userId);

    void updatePassword(String email, String newPassword);

    boolean existsByEmail(String email);
}

