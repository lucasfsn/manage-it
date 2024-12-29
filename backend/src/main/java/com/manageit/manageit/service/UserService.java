package com.manageit.manageit.service;


import com.manageit.manageit.dto.user.BasicUserDto;
import com.manageit.manageit.dto.user.UserResponseDto;
import com.manageit.manageit.mapper.user.BasicUserMapper;
import com.manageit.manageit.mapper.user.UserMapper;
import com.manageit.manageit.repository.UserRepository;
import com.manageit.manageit.security.JwtService;
import com.manageit.manageit.dto.user.AuthenticatedUserResponse;
import com.manageit.manageit.dto.user.UpdateUserRequest;
import com.manageit.manageit.model.user.User;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.manageit.manageit.model.project.Project;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final JwtService jwtService;
    private final UserMapper userMapper;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final BasicUserMapper basicUserMapper;

    public User getUserByToken(String token) {
        String username = jwtService.extractUsername(token.replace("Bearer ", ""));
        return getUserByUsername(username);
    }

    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username).orElseThrow(() -> new EntityNotFoundException("No user found with username: " + username));
    }

    public AuthenticatedUserResponse findByToken(String token) {
        User user = getUserByToken(token);
        return userMapper.toAuthenticatedUserResponse(user);
    }

    public UserResponseDto findByUsername(String token, String username) {
        String requestUsername = jwtService.extractUsername(token.replace("Bearer ", ""));
        User requestingUser = getUserByUsername(requestUsername);
        User user = getUserByUsername(username);

        List<Project> filteredProjects = user.getProjects().stream()
            .filter(project -> project.getMembers().contains(requestingUser))
            .collect(Collectors.toList());

        if (requestUsername.equals(username)) {
            return userMapper.toUserResponse(user, filteredProjects);
        }
        return userMapper.toUserResponseWithoutEmail(user, filteredProjects);
    }


    public UserResponseDto updateUser(String token, UpdateUserRequest updatedUser) {
        User user = getUserByToken(token);
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
        User savedUser = userRepository.save(user);
        return userMapper.toUserResponse(savedUser);
    }

    public List<BasicUserDto> searchUsers(String pattern, UUID projectId, UUID taskId) {
        if (projectId != null && taskId != null) {
            return userRepository.findByPatternInProjectExcludingTask(pattern, projectId, taskId)
                    .map(users -> users.stream()
                            .map(basicUserMapper::toBasicUserDto)
                            .toList())
                    .orElseThrow(() -> new EntityNotFoundException("No users found!"));
        }
        if (projectId != null) {
            return userRepository.findByPatternInAllFieldsNotInProject(pattern, projectId)
                    .map(users -> users.stream()
                            .map(basicUserMapper::toBasicUserDto)
                            .toList())
                    .orElseThrow(() -> new EntityNotFoundException("No users found!"));
        }
        // sprawdz czy podany task nalezy do projektu.
        return userRepository.findByPatternInAllFields(pattern)
                .map(users -> users.stream()
                        .map(basicUserMapper::toBasicUserDto)
                        .toList())
                .orElseThrow(() -> new EntityNotFoundException("No users found!"));

    }
}
