package com.manageit.manageit.feature.project.service;

import com.manageit.manageit.feature.project.dto.CreateProjectRequest;
import com.manageit.manageit.feature.project.dto.ProjectResponseDto;
import com.manageit.manageit.feature.project.dto.UpdateProjectRequest;
import com.manageit.manageit.feature.project.model.Project;
import com.manageit.manageit.feature.user.dto.UserResponseDto;
import com.manageit.manageit.feature.user.model.User;

import java.util.List;
import java.util.UUID;

public interface ProjectService {

    Project getProjectById(UUID projectId);

    List<ProjectResponseDto> getProjects(User user);

    ProjectResponseDto getProject(UUID id, User user);

    ProjectResponseDto createProject(User owner, CreateProjectRequest createProjectRequest);

    void deleteProject(User user, UUID projectId);

    ProjectResponseDto updateProject(User owner, UUID projectId, UpdateProjectRequest request);

    void addUserToProject(User user, UUID projectId, UserResponseDto request);

    ProjectResponseDto removeUserFromProject(User owner, UUID projectId, UserResponseDto request);
}
