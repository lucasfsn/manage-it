package com.manageit.manageit.service;


import com.manageit.manageit.dto.project.ProjectDto;
import com.manageit.manageit.dto.task.CreateTaskRequest;
import com.manageit.manageit.dto.task.TaskDto;
import com.manageit.manageit.dto.task.TaskMetadataDto;
import com.manageit.manageit.dto.task.UpdateTaskRequest;
import com.manageit.manageit.dto.user.BasicUserDto;
import com.manageit.manageit.exception.TaskNotInProjectException;
import com.manageit.manageit.exception.UnauthorizedProjectAccessException;
import com.manageit.manageit.mapper.task.TaskMapper;
import com.manageit.manageit.project.Project;
import com.manageit.manageit.repository.ProjectRepository;
import com.manageit.manageit.repository.TaskRepository;
import com.manageit.manageit.repository.UserRepository;
import com.manageit.manageit.security.JwtService;
import com.manageit.manageit.task.Task;
import com.manageit.manageit.user.User;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectService projectService;
    private final JwtService jwtService;
    private final TaskMapper taskMapper;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final NotificationService notificationService;

    public TaskDto getTask(String token, UUID projectId, UUID taskId) {
        String username = jwtService.extractUsername(token.replace("Bearer ", ""));
        ProjectDto project = projectService.getProject(projectId);
        if (project.getMembers().stream().noneMatch(member -> member.getUsername().equals(username))) {
            throw new UnauthorizedProjectAccessException("User " + username + " is not member of project");
        }
        Task task = taskRepository.findById(taskId).orElseThrow(() -> new EntityNotFoundException("No task found with id: " + taskId));
        if (!project.getId().equals(task.getProject().getId())) {
            throw new TaskNotInProjectException(taskId, projectId);
        }
        return taskMapper.toTaskDto(task);
    }

    public TaskMetadataDto createAndAddTaskToProject(String token, UUID projectId, CreateTaskRequest createTaskRequest) {
        String username = jwtService.extractUsername(token.replace("Bearer ", ""));
        User owner = userRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("No user found with username: " + username));
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException("No project found with id: " + projectId));
        if (project.getMembers().stream().noneMatch(member -> member.getName().equals(username))) {
            throw new UnauthorizedProjectAccessException("User " + username + " is not member of project");
        }
        Task task = Task.builder()
                .project(project)
                .description(createTaskRequest.getDescription())
                .status(createTaskRequest.getStatus())
                .priority(createTaskRequest.getPriority())
                .dueDate(createTaskRequest.getDueDate())
                .createdAt(LocalDateTime.now())
                .users(List.of())
                .build();
        taskRepository.save(task);
        notificationService.createAndSendNotification(
                project.getMembers(),
                owner,
                "has created task in " + project.getName(),
                project,
                task
        );
        return taskMapper.toTaskMetadataDto(task);
    }

    // spróbuj może przerobić tak, że nie pobierać taska z repozytorium tylko z projektu i tam usuwac, pzdr nara essa
    // orphanRemoval użyj pewnie no i wtedy usuwanie elementu z listy powinno zadzialać
    // nie rozumiem czemu Project dziala a ProjectDto juz nie
    public void deleteTask(String token, UUID taskId, UUID projectId) {
        String username = jwtService.extractUsername(token.replace("Bearer ", ""));
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("No user found with username: " + username));

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException("No project found with id: " + projectId));
        if (project.getMembers().stream().noneMatch(member -> member.getName().equals(username))) {
            throw new UnauthorizedProjectAccessException("User " + username + " is not member of project");
        }
        Task task = taskRepository.findById(taskId).orElseThrow(() -> new EntityNotFoundException("No task found with id: " + taskId));
        if (!project.getId().equals(task.getProject().getId())) {
            throw new TaskNotInProjectException(taskId, projectId);
        }
        taskRepository.delete(task);
        notificationService.createAndSendNotification(
                project.getMembers(),
                user,
                "has modified task in " + project.getName(),
                project,
                task
        );
    }

    public void updateTask(String token, UUID taskId, UUID projectId, UpdateTaskRequest request) {
        String username = jwtService.extractUsername(token.replace("Bearer ", ""));
        User updater = userRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("No user found with username: " + username));

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException("No project found with id: " + projectId));

        if (project.getMembers().stream().noneMatch(member -> member.getName().equals(username))) {
            throw new UnauthorizedProjectAccessException("User " + username + " is not member of project");
        }
        Task task = taskRepository.findById(taskId).orElseThrow(() -> new EntityNotFoundException("No task found with id: " + taskId));
        if (!project.getId().equals(task.getProject().getId())) {
            throw new TaskNotInProjectException(taskId, projectId);
        }
        if (request.getStatus() != null) {
            task.setStatus(request.getStatus());
        }
        if (request.getDescription() != null) {
            task.setDescription(request.getDescription());
        }
        if (request.getPriority() != null) {
            task.setPriority(request.getPriority());
        }
        if (request.getDueDate() != null) {
            task.setDueDate(request.getDueDate());
        }
        task.setUpdatedAt(LocalDateTime.now());
        taskRepository.save(task);
        notificationService.createAndSendNotification(
                project.getMembers(),
                updater,
                "has modified task in " + project.getName(),
                project,
                task
        );
     }

    public void addUserToProject(String token, UUID taskId, UUID projectId, BasicUserDto request) {
        String username = jwtService.extractUsername(token.replace("Bearer ", ""));
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException("No project found with id: " + projectId));
        User userToAdd = userRepository.findByUsername(request.getUsername()).orElseThrow(() -> new EntityNotFoundException("No user found with username: " + username));
        if (project.getMembers().stream().noneMatch(member -> member.getName().equals(username))) {
            throw new UnauthorizedProjectAccessException("User " + username + " is not member of project");
        }
        if (!project.getMembers().contains(userToAdd)) {
            throw new UnauthorizedProjectAccessException("User " + userToAdd.getName() + " is not member of project");
        }
        Task task = taskRepository.findById(taskId).orElseThrow(() -> new EntityNotFoundException("No task found with id: " + taskId));
        if (!project.getId().equals(task.getProject().getId())) {
            throw new TaskNotInProjectException(taskId, projectId);
        }
        if (!task.getUsers().contains(userToAdd)) {
            task.getUsers().add(userToAdd);
            task.setUpdatedAt(LocalDateTime.now());
            System.out.println(taskMapper.toTaskDto(task));
            taskRepository.save(task);
            notificationService.createAndSendNotification(
                    project.getMembers(),
                    userToAdd,
                    "has been added to task in " + project.getName(),
                    project,
                    task
            );
        }
    }

    public void removeUserFromTask(String token, UUID taskId, UUID projectId, BasicUserDto request) {
        String username = jwtService.extractUsername(token.replace("Bearer ", ""));
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException("No project found with id: " + projectId));
        if (project.getMembers().stream().noneMatch(member -> member.getName().equals(username))) {
            throw new UnauthorizedProjectAccessException("User " + username + " is not member of project");
        }
        Task task = taskRepository.findById(taskId).orElseThrow(() -> new EntityNotFoundException("No task found with id: " + taskId));
        if (!project.getId().equals(task.getProject().getId())) {
            throw new TaskNotInProjectException(taskId, projectId);
        }
        User userToRemove = userRepository.findByUsername(request.getUsername()).orElseThrow(() -> new EntityNotFoundException("No user found with username: " + username));
        if (task.getUsers().contains(userToRemove)) {
            task.getUsers().remove(userToRemove);
            task.setUpdatedAt(LocalDateTime.now());
            taskRepository.save(task);
            notificationService.createAndSendNotification(
                    project.getMembers(),
                    userToRemove,
                    "has been removed to task in " + project.getName(),
                    project,
                    task
            );
        }
    }
}

// to refactor