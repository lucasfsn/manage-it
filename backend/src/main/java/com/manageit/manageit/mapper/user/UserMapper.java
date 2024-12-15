package com.manageit.manageit.mapper.user;

import com.manageit.manageit.dto.user.UserResponseDto;
import com.manageit.manageit.mapper.project.ProjectMapper;
import com.manageit.manageit.dto.user.AuthenticatedUserResponse;
import com.manageit.manageit.model.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
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


    public UserResponseDto toUserResponse(User user) {
        return UserResponseDto
                .builder()
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .username(user.getName())
                .projects(user.getProjects().stream().map(projectMapper::toUserProfileProjectDto).collect(Collectors.toList()))
                .createdAt(user.getCreatedAt())
                .build();
    }

    public UserResponseDto toUserResponseWithoutEmail(User user) {
        return UserResponseDto
                .builder()
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .username(user.getName())
                .projects(user.getProjects().stream().map(projectMapper::toUserProfileProjectDto).collect(Collectors.toList()))
                .createdAt(user.getCreatedAt())
                .build();
    }
}
