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
import com.manageit.manageit.repository.UserRepository;
import com.manageit.manageit.security.JwtService;
import com.manageit.manageit.user.User;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final JwtService jwtService;
    private final ProjectRepository projectRepository;
    private final ProjectMapper projectMapper;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public List<ProjectDto> getProjects(String token) {
        String username = jwtService.extractUsername(token.replace("Bearer ", ""));
        return projectRepository.findByMembers_Username(username)
                .map(projects -> projects.stream()
                        .map(projectMapper::toProjectDto)
                        .toList())
                .orElseThrow(() -> new EntityNotFoundException("No projects found"));
    }

    public ProjectDto getProject(UUID id) {
        return projectRepository.findById(id)
                .map(projectMapper::toProjectDto)
                .orElseThrow(() -> new EntityNotFoundException("No project found with id: " + id));
    }

    public ProjectDto createProject(String token, CreateProjectRequest createProjectRequest) {
        String username = jwtService.extractUsername(token.replace("Bearer ", ""));
        User owner = userRepository.findByUsername(username).orElseThrow(() -> new EntityNotFoundException("No user found with username: " + username));
        Project project = Project.builder()
                .owner(owner)
                .name(createProjectRequest.getName())
                .description(createProjectRequest.getDescription())
                .status(ProjectStatus.IN_PROGRESS)
                .startDate(createProjectRequest.getStartDate())
                .endDate(createProjectRequest.getEndDate())
                .createdAt(LocalDateTime.now())
                .members(List.of(owner))
                .tasks(List.of())
                .build();
        projectRepository.save(project);
        return projectMapper.toProjectDto(project);

    }

    public void deleteProject(String token, UUID projectId) {
        String username = jwtService.extractUsername(token.replace("Bearer ", ""));
        User user = userRepository.findByUsername(username).orElseThrow(() -> new EntityNotFoundException("No user found with username: " + username));
        Project project = projectRepository.findById(projectId).orElseThrow(() -> new EntityNotFoundException("No project found with id: " + projectId));
        if (!project.getOwner().getId().equals(user.getId())) {
            throw new UnauthorizedProjectAccessException("User is not the owner of the project");
        }
        projectRepository.delete(project);
    }

    public void updateProject(String token, UUID projectId, UpdateProjectRequest request) {
        String username = jwtService.extractUsername(token.replace("Bearer ", ""));
        User owner = userRepository.findByUsername(username).orElseThrow(() -> new EntityNotFoundException("No user found with username: " + username));
        Project project = projectRepository.findById(projectId).orElseThrow(() -> new EntityNotFoundException("No project found with id: " + projectId));
        String message;
        if (!project.getOwner().getId().equals(owner.getId())) {
            throw new UnauthorizedProjectAccessException("User is not the owner of the project");
        }
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
                project,
                null
        );
    }

    public void addUserToProject(String token, UUID projectId, BasicUserDto request) {
        String username = jwtService.extractUsername(token.replace("Bearer ", ""));
        User user = userRepository.findByUsername(username).orElseThrow(() -> new EntityNotFoundException("No user found with username: " + username));
        Project project = projectRepository.findById(projectId).orElseThrow(() -> new EntityNotFoundException("No project found with id: " + projectId));
        if (!project.getOwner().getId().equals(user.getId())) {
            throw new UnauthorizedProjectAccessException("User is not the owner of the project");
        }
        User userToAdd = userRepository.findByUsername(request.getUsername()).orElseThrow(() -> new EntityNotFoundException("No user found with username: " + username));
        if (!project.getMembers().contains(userToAdd)) {
            project.getMembers().add(userToAdd);
            project.setUpdatedAt(LocalDateTime.now());
            projectRepository.save(project);
            notificationService.createAndSendNotification(
                    project.getMembers(),
                    userToAdd,
                    "has joined the project " + project.getName(),
                    project,
                    null
            );
        }
    }

    public void removeUserFromProject(String token, UUID projectId, BasicUserDto request) {
        String username = jwtService.extractUsername(token.replace("Bearer ", ""));
        User user = userRepository.findByUsername(username).orElseThrow(() -> new EntityNotFoundException("No user found with username: " + username));
        Project project = projectRepository.findById(projectId).orElseThrow(() -> new EntityNotFoundException("No project found with id: " + projectId));
        if (!project.getOwner().getId().equals(user.getId())) {
            throw new UnauthorizedProjectAccessException("User is not the owner of the project");
        }
        User userToRemove = userRepository.findByUsername(request.getUsername()).orElseThrow(() -> new EntityNotFoundException("No user found with username: " + username));
        if (project.getMembers().contains(userToRemove)) {
            project.getTasks().forEach(task -> {
                task.getUsers().remove(userToRemove);
            });
            project.getMembers().remove(userToRemove);
            project.setUpdatedAt(LocalDateTime.now());
            projectRepository.save(project);
            notificationService.createAndSendNotification(
                    project.getMembers(),
                    userToRemove,
                    "has left the project " + project.getName(),
                    project,
                    null
            );
        } else {
            throw new IllegalStateException("User is not a member of the project");
        }
    }
}
