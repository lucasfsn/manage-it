package com.manageit.manageit.service;

import com.manageit.manageit.dto.project.ProjectDto;
import com.manageit.manageit.dto.project.CreateProjectRequest;
import com.manageit.manageit.dto.project.UpdateProjectRequest;
import com.manageit.manageit.dto.user.BasicUserDto;
import com.manageit.manageit.exception.UnauthorizedProjectAccessException;
import com.manageit.manageit.mapper.project.ProjectMapper;
import com.manageit.manageit.project.Project;
import com.manageit.manageit.project.ProjectStatus;
import com.manageit.manageit.repository.ProjectRepository;
import com.manageit.manageit.user.User;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectMapper projectMapper;
    private final NotificationService notificationService;
    private final UserService userService;


    public Project getProjectById(UUID projectId) {
        return projectRepository.findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException("No project found with id: " + projectId));
    }

    public void validateUserIsProjectOwner(User user, Project project) {
        if (!project.getOwner().getId().equals(user.getId())) {
            throw new UnauthorizedProjectAccessException("User is not the owner of the project");
        }
    }

    public List<ProjectDto> getProjects(String token) {
        User user = userService.getUserByToken(token);
        return projectRepository.findByMembers_Username(user.getName())
                .map(projects -> projects.stream()
                        .map(projectMapper::toProjectDto)
                        .toList())
                .orElseThrow(() -> new EntityNotFoundException("No projects found"));
    }

    public ProjectDto getProject(UUID id) {
        Project project = getProjectById(id);
        return projectMapper.toProjectDto(project);
    }

    public ProjectDto createProject(String token, CreateProjectRequest createProjectRequest) {
        User owner = userService.getUserByToken(token);
        Project project = Project.builder()
                .owner(owner)
                .name(createProjectRequest.getName())
                .description(createProjectRequest.getDescription())
                .status(ProjectStatus.IN_PROGRESS)
                .startDate(createProjectRequest.getStartDate())
                .endDate(createProjectRequest.getEndDate())
                .members(List.of(owner))
                .tasks(List.of())
                .build();
        projectRepository.save(project);
        return projectMapper.toProjectDto(project);

    }

    public void deleteProject(String token, UUID projectId) {
        User user = userService.getUserByToken(token);
        Project project = getProjectById(projectId);
        validateUserIsProjectOwner(user, project);
        projectRepository.delete(project);
    }

    @Transactional
    public void updateProject(String token, UUID projectId, UpdateProjectRequest request) {
        User owner = userService.getUserByToken(token);
        Project project = getProjectById(projectId);
        String message;
        validateUserIsProjectOwner(owner, project);
        if (request.getStatus() != null) {
            project.setStatus(request.getStatus());
            message = "has marked the project " + project.getName() + "as completed";
        } else {
            message = "has modified the project " + project.getName();
            if (request.getName() != null) {
                project.setName(request.getName());
            }
            if (request.getDescription() != null) {
                project.setDescription(request.getDescription());
            }
            if (request.getStartDate() != null) {
                project.setStartDate(request.getStartDate());
            }
            if (request.getEndDate() != null) {
                project.setEndDate(request.getEndDate());
            }
        }
        project.setUpdatedAt(LocalDateTime.now());
        projectRepository.save(project);
        notificationService.createAndSendNotification(
                project.getMembers(),
                owner,
                message,
                project.getId(),
                null
        );
    }

    public void addUserToProject(String token, UUID projectId, BasicUserDto request) {
        User user = userService.getUserByToken(token);
        Project project = getProjectById(projectId);
        validateUserIsProjectOwner(user, project);
        User userToAdd = userService.getUserByUsername(request.getUsername());
        if (!project.getMembers().contains(userToAdd)) {
            project.getMembers().add(userToAdd);
            project.setUpdatedAt(LocalDateTime.now());
            projectRepository.save(project);
            notificationService.createAndSendNotification(
                    project.getMembers(),
                    userToAdd,
                    "has joined the project " + project.getName(),
                    project.getId(),
                    null
            );
        }
    }

    @Transactional
    public void removeUserFromProject(String token, UUID projectId, BasicUserDto request) {
        User owner = userService.getUserByToken(token);
        Project project = getProjectById(projectId);
        validateUserIsProjectOwner(owner, project);
        if (project.getOwner().getName().equals(request.getUsername())) {
            throw new IllegalArgumentException("Project owner cannot remove themselves from the project.");
        }
        User userToRemove = userService.getUserByUsername(request.getUsername());
        if (project.getMembers().contains(userToRemove)) {
            project.getTasks().forEach(task -> task.getUsers().remove(userToRemove));
            project.getMembers().remove(userToRemove);
            project.setUpdatedAt(LocalDateTime.now());
            projectRepository.save(project);
            notificationService.createAndSendNotification(
                    project.getMembers(),
                    userToRemove,
                    "has left the project " + project.getName(),
                    project.getId(),
                    null
            );
        } else {
            throw new IllegalStateException("User is not a member of the project");
        }
    }
}
