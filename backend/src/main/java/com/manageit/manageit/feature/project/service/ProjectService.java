package com.manageit.manageit.feature.project.service;

import com.manageit.manageit.feature.project.dto.CreateProjectRequest;
import com.manageit.manageit.feature.project.dto.ProjectDto;
import com.manageit.manageit.feature.project.dto.UpdateProjectRequest;
import com.manageit.manageit.feature.project.model.Project;
import com.manageit.manageit.feature.user.dto.BasicUserDto;
import com.manageit.manageit.feature.user.model.User;

import java.util.List;
import java.util.UUID;

public interface ProjectService {

    Project getProjectById(UUID projectId);

    List<ProjectDto> getProjects(User user);

    ProjectDto getProject(UUID id, User user);

    ProjectDto createProject(User owner, CreateProjectRequest createProjectRequest);

    void deleteProject(User user, UUID projectId);

    ProjectDto updateProject(User owner, UUID projectId, UpdateProjectRequest request);

    void addUserToProject(User user, UUID projectId, BasicUserDto request);

    ProjectDto removeUserFromProject(User owner, UUID projectId, BasicUserDto request);
}
