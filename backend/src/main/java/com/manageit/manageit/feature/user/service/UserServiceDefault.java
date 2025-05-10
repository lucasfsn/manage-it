package com.manageit.manageit.feature.user.service;


import com.manageit.manageit.feature.user.dto.BasicUserDto;
import com.manageit.manageit.feature.user.dto.UserResponseDto;
import com.manageit.manageit.feature.user.mapper.BasicUserMapper;
import com.manageit.manageit.feature.user.mapper.UserMapper;
import com.manageit.manageit.feature.user.repository.UserRepository;
import com.manageit.manageit.configuration.security.JwtService;
import com.manageit.manageit.feature.user.dto.AuthenticatedUserResponseDto;
import com.manageit.manageit.feature.user.dto.UpdateUserRequest;
import com.manageit.manageit.feature.user.model.User;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.manageit.manageit.feature.project.model.Project;

import java.util.List;
import java.util.UUID;


@Service
@RequiredArgsConstructor
public class UserServiceDefault implements UserService {

    private final JwtService jwtService;
    private final UserMapper userMapper;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final BasicUserMapper basicUserMapper;
    private static final String EXCEPTION_MESSAGE = "No users found!";

    @Override
    public User getUserByToken(String token) {
        String username = jwtService.extractUsername(token.replace("Bearer ", ""));
        return getUserByUsername(username);
    }

    @Override
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username).orElseThrow(() -> new EntityNotFoundException("No user found with username: " + username));
    }

    @Override
    public AuthenticatedUserResponseDto findByToken(String token) {
        User user = getUserByToken(token);
        return userMapper.toAuthenticatedUserResponse(user);
    }

    @Override
    public UserResponseDto findByUsername(User userDetails, String username) {
        User user = getUserByUsername(username);

        List<Project> filteredProjects = user.getProjects().stream()
                .filter(project -> project.getMembers().stream()
                        .anyMatch(member -> member.getName().equals(userDetails.getName())))
                .toList();

        if (userDetails.getName().equals(username)) {
            return userMapper.toUserResponse(user, filteredProjects);
        }
        return userMapper.toUserResponseWithoutEmail(user, filteredProjects);
    }

    @Override
    public UserResponseDto updateUser(User userDetails, UpdateUserRequest updatedUser) {
        if (updatedUser.getFirstName() != null) {
            userDetails.setFirstName(updatedUser.getFirstName());
        }
        if (updatedUser.getLastName() != null) {
            userDetails.setLastName(updatedUser.getLastName());
        }
        if (updatedUser.getEmail() != null) {
            userDetails.setEmail(updatedUser.getEmail());
        }
        if (updatedUser.getPassword() != null) {
            userDetails.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
        }
        User savedUser = userRepository.save(userDetails);
        return userMapper.toUserResponse(savedUser);
    }

    @Override
    public List<BasicUserDto> searchUsers(String pattern, UUID projectId, UUID taskId) {
        if (projectId != null && taskId != null) {
            return userRepository.findByPatternInProjectExcludingTask(pattern, projectId, taskId)
                    .map(users -> users.stream()
                            .map(basicUserMapper::toBasicUserDto)
                            .toList())
                    .orElseThrow(() -> new EntityNotFoundException(EXCEPTION_MESSAGE));
        }
        if (projectId != null) {
            return userRepository.findByPatternInAllFieldsNotInProject(pattern, projectId)
                    .map(users -> users.stream()
                            .map(basicUserMapper::toBasicUserDto)
                            .toList())
                    .orElseThrow(() -> new EntityNotFoundException(EXCEPTION_MESSAGE));
        }
        return userRepository.findByPatternInAllFields(pattern)
                .map(users -> users.stream()
                        .map(basicUserMapper::toBasicUserDto)
                        .toList())
                .orElseThrow(() -> new EntityNotFoundException(EXCEPTION_MESSAGE));

    }

    public void removeUser(User userDetails) {
        userRepository.deleteById(userDetails.getId());
    }
}
