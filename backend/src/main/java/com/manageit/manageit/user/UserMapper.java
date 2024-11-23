package com.manageit.manageit.user;

import com.manageit.manageit.project.ProjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor

// do poprawy
public class UserMapper {

    private final ProjectMapper projectMapper;

    public AuthenticatedUserResponse toAuthenticatedUserResponse(User user) {
        return AuthenticatedUserResponse
                .builder()
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .username(user.getName())
                .build();
    }


    public UserResponse toUserResponse(User user) {
        return UserResponse
                .builder()
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .username(user.getName())
                .createdAt(user.getCreatedAt())
                .projects(user.getProjects().stream().map(projectMapper::toProjectResponse).collect(Collectors.toList()))
                .build();
    }

    public UserResponse toUserResponseWithoutEmail(User user) {
        return UserResponse
                .builder()
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .username(user.getName())
                .createdAt(user.getCreatedAt())
                .projects(user.getProjects().stream().map(projectMapper::toProjectResponse).collect(Collectors.toList()))
                .build();
    }

    public UserResponse toBasicUserResponse(User user) {
        return UserResponse
                .builder()
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .username(user.getName())
                .build();
    }
}
