package com.manageit.manageit.service;


import com.manageit.manageit.dto.project.ProjectDto;
import com.manageit.manageit.dto.task.TaskDto;
import com.manageit.manageit.exception.TaskNotInProjectException;
import com.manageit.manageit.exception.UnauthorizedProjectAccessException;
import com.manageit.manageit.mapper.task.TaskMapper;
import com.manageit.manageit.repository.TaskRepository;
import com.manageit.manageit.security.JwtService;
import com.manageit.manageit.task.Task;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectService projectService;
    private final JwtService jwtService;
    private final TaskMapper taskMapper;

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
}
