package com.manageit.manageit.feature.project.service;

import com.manageit.manageit.feature.project.dto.ProjectDto;
import com.manageit.manageit.feature.project.dto.CreateProjectRequest;
import com.manageit.manageit.feature.project.dto.UpdateProjectRequest;
import com.manageit.manageit.feature.task.repository.TaskRepository;
import com.manageit.manageit.feature.user.dto.BasicUserDto;
import com.manageit.manageit.core.exception.UserNotInProjectException;
import com.manageit.manageit.feature.user.service.UserService;
import com.manageit.manageit.feature.project.mapper.ProjectMapper;
import com.manageit.manageit.feature.project.model.Project;
import com.manageit.manageit.feature.project.model.ProjectStatus;
import com.manageit.manageit.feature.project.repository.ProjectRepository;
import com.manageit.manageit.feature.user.model.User;
import com.manageit.manageit.feature.chat.service.ChatService;
import com.manageit.manageit.feature.notification.service.NotificationService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.PersistenceContext;
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
    private final ChatService chatService;
    private final TaskRepository taskRepository;
    @PersistenceContext
    private EntityManager entityManager;


    public Project getProjectById(UUID projectId) {
        return projectRepository.findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException("No project found with id: " + projectId));
    }

    public List<ProjectDto> getProjects(User user) {
        return projectRepository.findByMembers_Username(user.getName())
                .map(projects -> projects.stream()
                        .map(projectMapper::toProjectDto)
                        .toList())
                .orElseThrow(() -> new EntityNotFoundException("No projects found"));
    }

    public ProjectDto getProject(UUID id, User user) {
        Project project = getProjectById(id);
        if (project.getMembers().stream().noneMatch(member -> member.getName().equals(user.getName()))) {
            throw new UserNotInProjectException("User " + user.getName() + " is not member of project");
        }
        return projectMapper.toProjectDto(project);
    }

    @Transactional
    public ProjectDto createProject(User owner, CreateProjectRequest createProjectRequest) {
        User managedOwner = entityManager.merge(owner);
        Project project = Project.builder()
                .owner(managedOwner)
                .name(createProjectRequest.getName())
                .description(createProjectRequest.getDescription())
                .status(ProjectStatus.IN_PROGRESS)
                .startDate(createProjectRequest.getStartDate())
                .endDate(createProjectRequest.getEndDate())
                .members(List.of(managedOwner))
                .tasks(List.of())
                .build();
        Project newProject = projectRepository.save(project);
        chatService.saveChat(newProject);
        return projectMapper.toProjectDto(project);

    }

    @Transactional
    public void deleteProject(User user, UUID projectId) {
        Project project = getProjectById(projectId);
        validateUserIsProjectOwner(user, project);
        taskRepository.deleteAll(project.getTasks());
        projectRepository.delete(project);
    }

    @Transactional
    public ProjectDto updateProject(User owner, UUID projectId, UpdateProjectRequest request) {
        User managedOwner = entityManager.merge(owner);
        Project project = getProjectById(projectId);
        String message;
        validateUserIsProjectOwner(managedOwner, project);
        if (request.getStatus() != null) {
            project.setStatus(request.getStatus());
            message = "project;complete;" + project.getName();
        } else {
            message = "project;update;" + project.getName();
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
        Project updatedProject = projectRepository.save(project);
        notificationService.createAndSendNotification(
                project.getMembers(),
                managedOwner,
                message,
                project.getId(),
                null
        );
        return projectMapper.toProjectDto(updatedProject);
    }

    @Transactional
    public void addUserToProject(User user, UUID projectId, BasicUserDto request) {
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
                    "project;join;" + project.getName(),
                    project.getId(),
                    null
            );
        }
    }

    @Transactional
    public ProjectDto removeUserFromProject(User owner, UUID projectId, BasicUserDto request) {
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
            Project updatedProject = projectRepository.save(project);
            notificationService.createAndSendNotification(
                    project.getMembers(),
                    userToRemove,
                    "project;leave;" + project.getName(),
                    project.getId(),
                    null
            );
            return projectMapper.toProjectDto(updatedProject);
        } else {
            throw new UserNotInProjectException("User is not a member of the project");
        }
    }

    private void validateUserIsProjectOwner(User user, Project project) {
        if (!project.getOwner().getId().equals(user.getId())) {
            throw new UserNotInProjectException("User is not the owner of the project");
        }
    }
}
