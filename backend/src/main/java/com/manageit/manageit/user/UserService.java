package com.manageit.manageit.user;


import com.manageit.manageit.security.JwtService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final JwtService jwtService;
    private final UserMapper userMapper;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthenticatedUserResponse findByToken(String token) {
        String username = jwtService.extractUsername(token.replace("Bearer ", ""));
        return userRepository.findByUsername(username)
                .map(userMapper::toAuthenticatedUserResponse)
                .orElseThrow(() -> new EntityNotFoundException("No user found with username: " + username));
    }

    public UserResponse findByUsername(String token, String username) {
        String requestUsername = jwtService.extractUsername(token.replace("Bearer ", ""));
        if (requestUsername.equals(username)) {
            return userRepository.findByUsername(username)
                    .map(userMapper::toUserResponse)
                    .orElseThrow(() -> new EntityNotFoundException("No user found with username: " + username));
        }
        return userRepository.findByUsername(username)
                .map(userMapper::toUserResponseWithoutEmail)
                .orElseThrow(() -> new EntityNotFoundException("No user found with username: " + username));
    }


    public boolean updateUser(String token, UpdateUserRequest updatedUser) {
        String username = jwtService.extractUsername(token.replace("Bearer ", ""));
        return userRepository.findByUsername(username)
                .map(user -> {
                    if (updatedUser.getFirstName() != null) {
                        user.setFirstName(updatedUser.getFirstName());
                    }
                    if (updatedUser.getLastName() != null) {
                        user.setLastName(updatedUser.getLastName());
                    }
                    if (updatedUser.getEmail() != null) {
                        user.setEmail(updatedUser.getEmail());
                    }
                    if (updatedUser.getPassword() != null) {
                        user.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
                    }
                    userRepository.save(user);
                    return true;
                })
                .orElseThrow(() -> new EntityNotFoundException("No user found with username: " + username));
    }

    public List<UserResponse> searchUsers(String pattern, UUID projectId) {
        if (projectId == null) {
            return userRepository.findByUsernameContainingIgnoreCase(pattern)
                    .map(users -> users.stream()
                            .map(userMapper::toBasicUserResponse)
                            .toList())
                    .orElseThrow(() -> new EntityNotFoundException("No users found!"));
        }
        return userRepository.findByUsernameContainingIgnoreCaseInProject(pattern, projectId)
                .map(users -> users.stream()
                        .map(userMapper::toBasicUserResponse)
                        .toList())
                .orElseThrow(() -> new EntityNotFoundException("No users found!"));
    }
}
