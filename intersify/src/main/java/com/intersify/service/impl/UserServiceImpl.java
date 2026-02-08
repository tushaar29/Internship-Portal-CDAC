package com.intersify.service.impl;

import com.intersify.entity.CompanyProfile;
import com.intersify.entity.StudentProfile;
import com.intersify.entity.User;
import com.intersify.enums.AuthProvider;
import com.intersify.enums.Role;
import com.intersify.repository.CompanyProfileRepository;
import com.intersify.repository.StudentProfileRepository;
import com.intersify.repository.UserRepository;
import com.intersify.service.UserService;
import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    
    private final PasswordEncoder passwordEncoder;


    @Override
    public User registerUser(String name, String email, String password, Role role) {

        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already registered");
        }

        // 1️⃣ Create User
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role);
        user.setProvider(AuthProvider.LOCAL);

        // 2️⃣ Create role-based profile BEFORE saving user
        if (role == Role.STUDENT) {

            StudentProfile studentProfile = new StudentProfile();
            studentProfile.setUser(user);          // owning side
            user.setStudentProfile(studentProfile); // inverse side

        } else if (role == Role.COMPANY) {

            CompanyProfile companyProfile = new CompanyProfile();
            companyProfile.setUser(user);            // owning side
            user.setCompanyProfile(companyProfile);  // inverse side
        }

        // 3️⃣ Save ONLY user
        // Cascade + MapsId will take care of profile insert
        return userRepository.save(user);
    }


    // 🔐 LOGIN (Security-aligned)
    @Override
    public User loginUser(String email, String password) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (user.getProvider() != AuthProvider.LOCAL) {
            throw new RuntimeException("Please login using Google or Facebook");
        }
        
        // ⚠️ Later this becomes passwordEncoder.matches()
        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Invalid email or password");
        }

        return user;
    }

    @Override
    public User updateUser(Long userId, String name, String email) {

        User user = getUserById(userId);

        user.setName(name);
        user.setEmail(email);

        return userRepository.save(user);
    }

    @Override
    public void deleteUser(Long userId) {

        User user = getUserById(userId);
        userRepository.delete(user);
    }

    @Override
    public User getUserById(Long userId) {

        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    public void updatePassword(String email, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    @Override
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
}

