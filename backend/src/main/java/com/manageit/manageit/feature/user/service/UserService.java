package com.manageit.manageit.feature.user.service;

import com.manageit.manageit.feature.user.dto.AuthenticatedUserResponseDto;
import com.manageit.manageit.feature.user.dto.UserResponseDto;
import com.manageit.manageit.feature.user.dto.UpdateUserRequestDto;
import com.manageit.manageit.feature.user.dto.UserDetailsResponseDto;
import com.manageit.manageit.feature.user.model.User;

import java.util.List;
import java.util.UUID;

public interface UserService {
    User getUserByToken(String token);

    User getUserByUsername(String username);

    AuthenticatedUserResponseDto findByToken(String token);

    UserDetailsResponseDto findByUsername(User userDetails, String username);

    UserDetailsResponseDto updateUser(User userDetails, UpdateUserRequestDto updatedUser);

    List<UserResponseDto> searchUsers(String pattern, UUID projectId, UUID taskId);

    void removeUser(User userDetails);
}
