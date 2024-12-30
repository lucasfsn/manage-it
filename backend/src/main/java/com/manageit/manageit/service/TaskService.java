package com.manageit.manageit.service;


import com.manageit.manageit.dto.task.CreateTaskRequest;
import com.manageit.manageit.dto.task.TaskDto;
import com.manageit.manageit.dto.task.TaskMetadataDto;
import com.manageit.manageit.dto.task.UpdateTaskRequest;
import com.manageit.manageit.dto.user.BasicUserDto;
import com.manageit.manageit.exception.TaskNotInProjectException;
import com.manageit.manageit.exception.UserNotInProjectException;
import com.manageit.manageit.exception.UserNotInTaskException;
import com.manageit.manageit.mapper.task.TaskMapper;
import com.manageit.manageit.model.project.Project;
import com.manageit.manageit.repository.TaskRepository;
import com.manageit.manageit.model.task.Task;
import com.manageit.manageit.model.user.User;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
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
    private final TaskMapper taskMapper;
    private final NotificationService notificationService;
    private final UserService userService;
    private final ChatService chatService;

    public Task getTaskById(UUID id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("No task found with id: " + id));
    }

    public TaskDto getTask(String token, UUID projectId, UUID taskId) {
        User user = userService.getUserByToken(token);
        Project project = projectService.getProjectById(projectId);
        if (project.getMembers().stream().noneMatch(member -> member.getName().equals(user.getName()))) {
            throw new UserNotInProjectException("User " + user.getName() + " is not member of project");
        }
        Task task = getTaskById(taskId);
        if (!project.getId().equals(task.getProject().getId())) {
            throw new TaskNotInProjectException(taskId, projectId);
        }
        return taskMapper.toTaskDto(task);
    }

    @Transactional
    public TaskMetadataDto createAndAddTaskToProject(String token, UUID projectId, CreateTaskRequest createTaskRequest) {
        User owner = userService.getUserByToken(token);
        Project project = projectService.getProjectById(projectId);
        if (project.getMembers().stream().noneMatch(member -> member.getName().equals(owner.getName()))) {
            throw new UserNotInProjectException("User " + owner.getName() + " is not member of project");
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
        Task savedTask = taskRepository.save(task);
        notificationService.createAndSendNotification(
                project.getMembers(),
                owner,
                "task;create;" + project.getName(),
                projectId,
                task.getId()
        );
        chatService.saveChat(project, savedTask);
        return taskMapper.toTaskMetadataDto(task);
    }

    public void deleteTask(String token, UUID taskId, UUID projectId) {
        User user = userService.getUserByToken(token);
        Project project = projectService.getProjectById(projectId);
        if (project.getMembers().stream().noneMatch(member -> member.getName().equals(user.getName()))) {
            throw new UserNotInProjectException("User " + user.getName() + " is not member of project");
        }
        Task task = getTaskById(taskId);
        if (!project.getId().equals(task.getProject().getId())) {
            throw new TaskNotInProjectException(taskId, projectId);
        }
        notificationService.createAndSendNotification(
                project.getMembers(),
                user,
                "task;delete;" + project.getName(),
                project.getId(),
                task.getId()
        );
        taskRepository.delete(task);
    }

    public TaskDto updateTask(String token, UUID taskId, UUID projectId, UpdateTaskRequest request) {
        User updater = userService.getUserByToken(token);
        Project project = projectService.getProjectById(projectId);
        if (project.getMembers().stream().noneMatch(member -> member.getName().equals(updater.getName()))) {
            throw new UserNotInProjectException("User " + updater.getName() + " is not member of project");
        }
        Task task = taskRepository
                .findById(taskId)
                .orElseThrow(() -> new EntityNotFoundException("No task found with id: " + taskId));
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
        Task updatedTask = taskRepository.save(task);
        notificationService.createAndSendNotification(
                project.getMembers(),
                updater,
                "task;update;" + project.getName(),
                project.getId(),
                task.getId()
        );
        return taskMapper.toTaskDto(updatedTask);
     }

    public TaskDto addUserToTask(String token, UUID taskId, UUID projectId, BasicUserDto request) {
        User user = userService.getUserByToken(token);
        Project project = projectService.getProjectById(projectId);
        User userToAdd = userService.getUserByUsername(request.getUsername());
        if (project.getMembers().stream().noneMatch(member -> member.getName().equals(user.getName()))) {
            throw new UserNotInProjectException("User " + user.getName() + " is not member of project");
        }
        if (!project.getMembers().contains(userToAdd)) {
            throw new UserNotInProjectException("User " + userToAdd.getName() + " is not member of project");
        }
        Task task = getTaskById(taskId);
        if (!project.getId().equals(task.getProject().getId())) {
            throw new TaskNotInProjectException(taskId, projectId);
        }
        if (!task.getUsers().contains(userToAdd)) {
            task.getUsers().add(userToAdd);
            task.setUpdatedAt(LocalDateTime.now());
            Task updatedTask = taskRepository.save(task);
            notificationService.createAndSendNotification(
                    project.getMembers(),
                    userToAdd,
                    "task;join;" + project.getName(),
                    project.getId(),
                    task.getId()
            );
            return taskMapper.toTaskDto(updatedTask);
        } else {
            throw new IllegalStateException("User is already a member of the task");
        }
    }

    public TaskDto removeUserFromTask(String token, UUID taskId, UUID projectId, BasicUserDto request) {
        User user = userService.getUserByToken(token);
        Project project = projectService.getProjectById(projectId);
        if (project.getMembers().stream().noneMatch(member -> member.getName().equals(user.getName()))) {
            throw new UserNotInProjectException("User " + user.getName() + " is not member of project");
        }
        Task task = getTaskById(taskId);
        if (!project.getId().equals(task.getProject().getId())) {
            throw new TaskNotInProjectException(taskId, projectId);
        }
        User userToRemove = userService.getUserByUsername(request.getUsername());
        if (task.getUsers().contains(userToRemove)) {
            task.getUsers().remove(userToRemove);
            task.setUpdatedAt(LocalDateTime.now());
            Task updatedTask = taskRepository.save(task);
            notificationService.createAndSendNotification(
                    project.getMembers(),
                    userToRemove,
                    "task;leave;" + project.getName(),
                    project.getId(),
                    task.getId()
            );
            return taskMapper.toTaskDto(updatedTask);
        } else {
            throw new UserNotInTaskException("User is not a member of the task");
        }
    }
}