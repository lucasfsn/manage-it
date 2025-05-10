package com.manageit.manageit.feature.user.mapper;

import com.manageit.manageit.feature.project.model.Project;
import com.manageit.manageit.feature.user.dto.AuthenticatedUserResponseDto;
import com.manageit.manageit.feature.user.dto.UserDetailsResponseDto;
import com.manageit.manageit.feature.user.dto.UserResponseDto;
import com.manageit.manageit.feature.user.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserResponseDto toUserResponseDto(User user);

    AuthenticatedUserResponseDto toAuthenticatedUserResponse(User user);

    UserDetailsResponseDto toUserDetailsResponseDto(User user);

    @Mapping(source = "projects", target = "projects")
    UserDetailsResponseDto toUserDetailsResponseDto(User user, List<Project> projects);

    @Mapping(source = "projects", target = "projects")
    @Mapping(target = "email", ignore = true)
    UserDetailsResponseDto toUserResponseWithoutEmail(User user, List<Project> projects);
}
