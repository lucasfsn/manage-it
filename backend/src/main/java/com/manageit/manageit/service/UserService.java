package com.manageit.manageit.service;


import com.manageit.manageit.dto.user.BasicUserDto;
import com.manageit.manageit.dto.user.UserResponseDto;
import com.manageit.manageit.mapper.user.BasicUserMapper;
import com.manageit.manageit.mapper.user.UserMapper;
import com.manageit.manageit.repository.UserRepository;
import com.manageit.manageit.security.JwtService;
import com.manageit.manageit.user.AuthenticatedUserResponse;
import com.manageit.manageit.user.UpdateUserRequest;
import com.manageit.manageit.user.User;
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
    private final BasicUserMapper basicUserMapper;

    public AuthenticatedUserResponse findByToken(String token) {
        String username = jwtService.extractUsername(token.replace("Bearer ", ""));
        return userRepository.findByUsername(username)
                .map(userMapper::toAuthenticatedUserResponse)
                .orElseThrow(() -> new EntityNotFoundException("No user found with username: " + username));
    }

    public UserResponseDto findByUsername(String token, String username) {
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


    public void updateUser(String token, UpdateUserRequest updatedUser) {
        String tokenUsername = jwtService.extractUsername(token.replace("Bearer ", ""));
        User user = userRepository.findByUsername(tokenUsername)
                .orElseThrow(() -> new EntityNotFoundException("No user found with username: " + tokenUsername));
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
    }

    public List<BasicUserDto> searchUsers(String pattern, UUID projectId, UUID taskId) {
        if (projectId == null && taskId == null) {
            return userRepository.findByPatternInAllFields(pattern)
                    .map(users -> users.stream()
                            .map(basicUserMapper::toBasicUserDto)
                            .toList())
                    .orElseThrow(() -> new EntityNotFoundException("No users found!"));
        }
        if (taskId == null) {
            return userRepository.findByPatternInAllFieldsInProject(pattern, projectId)
                    .map(users -> users.stream()
                            .map(basicUserMapper::toBasicUserDto)
                            .toList())
                    .orElseThrow(() -> new EntityNotFoundException("No users found!"));
        }
        // sprawdz czy podany task nalezy do projektu.
        return userRepository.findByPatternInProjectExcludingTask(pattern, projectId, taskId)
                .map(users -> users.stream()
                        .map(basicUserMapper::toBasicUserDto)
                        .toList())
                .orElseThrow(() -> new EntityNotFoundException("No users found!"));

    }
}
