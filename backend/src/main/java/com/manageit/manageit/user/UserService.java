package com.manageit.manageit.user;


import com.manageit.manageit.security.JwtService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final JwtService jwtService;
    private final UserMapper userMapper;
    private final UserRepository userRepository;

    public UserResponse findByToken(String token) {
        String userId = jwtService.extractUserId(token.replace("Bearer ", ""));
        return userRepository.findById(UUID.fromString(userId))
                .map(userMapper::toUserResponse)
                .orElseThrow(() -> new EntityNotFoundException("No user found with ID: " + userId));
    }
}
