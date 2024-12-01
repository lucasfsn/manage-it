package com.manageit.manageit.service;


import com.manageit.manageit.dto.project.ProjectDto;
import com.manageit.manageit.dto.task.CreateTaskRequest;
import com.manageit.manageit.dto.task.TaskDto;
import com.manageit.manageit.dto.task.TaskMetadataDto;
import com.manageit.manageit.exception.TaskNotInProjectException;
import com.manageit.manageit.exception.UnauthorizedProjectAccessException;
import com.manageit.manageit.mapper.task.TaskMapper;
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

    public TaskDto getTask(String token, UUID projectId, UUID taskId) {
        String username = jwtService.extractUsername(token.replace("Bearer ", ""));
        ProjectDto project = projectService.getProject(projectId);
        if (project.getMembers().stream().noneMatch(member -> member.getUsername().equals(username))) {
            throw new UnauthorizedProjectAccessException("User " + username + " is not member of project");
        }
        Task task = taskRepository.findById(taskId).orElseThrow(() -> new EntityNotFoundException("No task found with id: " + taskId));
        if (!project.getId().equals(task.getProjectId())) {
            throw new TaskNotInProjectException(taskId, projectId);
        }
        return taskMapper.toTaskDto(task);
    }

    public TaskMetadataDto createAndAddTaskToProject(String token, UUID projectId, CreateTaskRequest createTaskRequest) {
        String username = jwtService.extractUsername(token.replace("Bearer ", ""));
        ProjectDto project = projectService.getProject(projectId);
        if (project.getMembers().stream().noneMatch(member -> member.getUsername().equals(username))) {
            throw new UnauthorizedProjectAccessException("User " + username + " is not member of project");
        }
        Task task = Task.builder()
                .projectId(project.getId())
                .description(createTaskRequest.getDescription())
                .status(createTaskRequest.getStatus())
                .priority(createTaskRequest.getPriority())
                .dueDate(createTaskRequest.getDueDate())
                .createdAt(LocalDateTime.now())
                .users(List.of())
                .build();
        taskRepository.save(task);
        return taskMapper.toTaskMetadataDto(task);
    }

}
