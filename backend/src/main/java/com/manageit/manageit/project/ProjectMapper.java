package com.manageit.manageit.project;

import com.manageit.manageit.user.User;
import com.manageit.manageit.user.UserMapper;
import com.manageit.manageit.user.UserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectMapper {
    // do poprawy

    public ProjectResponse toProjectResponse(Project project) {
        return ProjectResponse.builder()
                .id(project.getId())
                .owner(toUserResponse(project.getOwner()))
                .projectName(project.getProjectName())
                .description(project.getDescription())
                .status(project.getStatus())
                .createdAt(project.getCreatedAt())
                .updatedAt(project.getUpdatedAt())
                .startDate(project.getStartDate())
                .endDate(project.getEndDate())
                .members(project.getMembers().stream().map(this::toUserResponse).collect(Collectors.toList()))
                .build();
    }

    private UserResponse toUserResponse(User user) {
        return UserResponse.builder()
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .username(user.getName())
                .build();
    }
}
