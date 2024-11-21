package com.manageit.manageit.user;

import org.springframework.stereotype.Service;

@Service
public class UserMapper {

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
                .projects(user.getProjects())
                .build();
    }

    public UserResponse toUserResponseWithoutEmail(User user) {
        return UserResponse
                .builder()
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .username(user.getName())
                .createdAt(user.getCreatedAt())
                .projects(user.getProjects())
                .build();
    }
}
