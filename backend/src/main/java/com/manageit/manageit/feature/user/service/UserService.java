package com.manageit.manageit.feature.user.service;

import com.manageit.manageit.feature.user.dto.AuthenticatedUserResponseDto;
import com.manageit.manageit.feature.user.dto.BasicUserDto;
import com.manageit.manageit.feature.user.dto.UpdateUserRequest;
import com.manageit.manageit.feature.user.dto.UserResponseDto;
import com.manageit.manageit.feature.user.model.User;

import java.util.List;
import java.util.UUID;

public interface UserService {
    User getUserByToken(String token);

    User getUserByUsername(String username);

    AuthenticatedUserResponseDto findByToken(String token);

    UserResponseDto findByUsername(User userDetails, String username);

    UserResponseDto updateUser(User userDetails, UpdateUserRequest updatedUser);

    List<BasicUserDto> searchUsers(String pattern, UUID projectId, UUID taskId);

    void removeUser(User userDetails);
}
