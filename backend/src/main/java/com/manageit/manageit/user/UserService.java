package com.manageit.manageit.user;


import com.manageit.manageit.security.JwtService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final JwtService jwtService;
    private final UserMapper userMapper;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserResponse findByToken(String token) {
        String username = jwtService.extractUsername(token.replace("Bearer ", ""));
        return this.findByUsername(username);
    }

    public UserResponse findByUsername(String username) {
        return userRepository.findByUsername(username)
                .map(userMapper::toUserResponse)
                .orElseThrow(() -> new EntityNotFoundException("No user found with username: " + username));
    }

    public boolean updateUser(String token, UpdateUserRequest updatedUser) {
        String username = jwtService.extractUsername(token.replace("Bearer ", ""));
        return userRepository.findByUsername(username)
                .map(user -> {
                    user.setFirstName(updatedUser.getFirstName());
                    user.setLastName(updatedUser.getLastName());
                    user.setEmail(updatedUser.getEmail());
                    if (updatedUser.getPassword() != null) {
                        user.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
                    }
                    userRepository.save(user);
                    return true;
                })
                .orElseThrow(() -> new EntityNotFoundException("No user found with username: " + username);
    }
}
