package com.manageit.manageit.feature.user.mapper;

import com.manageit.manageit.feature.user.dto.UserResponseDto;
import com.manageit.manageit.feature.project.mapper.ProjectMapper;
import com.manageit.manageit.feature.user.dto.AuthenticatedUserResponseDto;
import com.manageit.manageit.feature.user.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.manageit.manageit.feature.project.model.Project;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserMapper {
    private final ProjectMapper projectMapper;

    public AuthenticatedUserResponseDto toAuthenticatedUserResponse(User user) {
        return AuthenticatedUserResponseDto
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

    public UserResponseDto toUserResponse(User user, List<Project> filteredProjects) {
        return UserResponseDto
                .builder()
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .username(user.getName())
                .projects(filteredProjects.stream().map(projectMapper::toUserProfileProjectDto).collect(Collectors.toList()))
                .createdAt(user.getCreatedAt())
                .build();
    }   

//    public UserResponseDto toUserResponseWithoutEmail(User user) {
//        return UserResponseDto
//                .builder()
//                .firstName(user.getFirstName())
//                .lastName(user.getLastName())
//                .username(user.getName())
//                .projects(user.getProjects().stream().map(projectMapper::toUserProfileProjectDto).collect(Collectors.toList()))
//                .createdAt(user.getCreatedAt())
//                .build();
//    }

    public UserResponseDto toUserResponseWithoutEmail(User user, List<Project> filteredProjects) {
        return UserResponseDto
                .builder()
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .username(user.getName())
                .projects(filteredProjects.stream().map(projectMapper::toUserProfileProjectDto).collect(Collectors.toList()))
                .createdAt(user.getCreatedAt())
                .build();
    }
}
