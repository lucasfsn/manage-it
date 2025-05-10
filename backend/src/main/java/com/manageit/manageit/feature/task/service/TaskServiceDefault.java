package com.manageit.manageit.feature.task.service;


import com.manageit.manageit.feature.task.dto.CreateTaskRequest;
import com.manageit.manageit.feature.task.dto.TaskResponseDto;
import com.manageit.manageit.feature.task.dto.TaskDetailsResponseDto;
import com.manageit.manageit.feature.task.dto.UpdateTaskRequest;
import com.manageit.manageit.feature.user.dto.UserResponseDto;
import com.manageit.manageit.core.exception.TaskNotInProjectException;
import com.manageit.manageit.core.exception.UserNotInProjectException;
import com.manageit.manageit.core.exception.UserNotInTaskException;
import com.manageit.manageit.feature.user.service.UserService;
import com.manageit.manageit.feature.task.mapper.TaskMapper;
import com.manageit.manageit.feature.project.model.Project;
import com.manageit.manageit.feature.task.repository.TaskRepository;
import com.manageit.manageit.feature.task.model.Task;
import com.manageit.manageit.feature.user.model.User;
import com.manageit.manageit.feature.chat.service.ChatService;
import com.manageit.manageit.feature.notification.service.NotificationService;
import com.manageit.manageit.feature.project.service.ProjectService;
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
public class TaskServiceDefault implements TaskService {

    private final TaskRepository taskRepository;
    private final ProjectService projectService;
    private final TaskMapper taskMapper;
    private final NotificationService notificationService;
    private final UserService userService;
    private final ChatService chatService;

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Task getTaskById(UUID id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("No task found with id: " + id));
    }

    @Override
    public TaskResponseDto getTask(User user, UUID projectId, UUID taskId) {
        Project project = projectService.getProjectById(projectId);
        checkIfUserIsMemberOfProject(user, project);
        Task task = getTaskById(taskId);
        if (!project.getId().equals(task.getProject().getId())) {
            throw new TaskNotInProjectException(taskId, projectId);
        }
        return taskMapper.toTaskResponseDto(task);
    }

    @Override
    @Transactional
    public TaskDetailsResponseDto createAndAddTaskToProject(User owner, UUID projectId, CreateTaskRequest createTaskRequest) {
        User managedOwner = entityManager.merge(owner);
        Project project = projectService.getProjectById(projectId);
        checkIfUserIsMemberOfProject(owner, project);
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
                managedOwner,
                "task;create;" + project.getName(),
                projectId,
                task.getId()
        );
        chatService.saveChat(project, savedTask);
        return taskMapper.toTaskDetailsResponseDto(savedTask);
    }

    @Override
    @Transactional
    public void deleteTask(User user, UUID taskId, UUID projectId) {
        User managedUser = entityManager.merge(user);
        Project project = projectService.getProjectById(projectId);
        checkIfUserIsMemberOfProject(user, project);
        Task task = getTaskById(taskId);
        if (!project.getId().equals(task.getProject().getId())) {
            throw new TaskNotInProjectException(taskId, projectId);
        }
        notificationService.createAndSendNotification(
                project.getMembers(),
                managedUser,
                "task;delete;" + project.getName(),
                project.getId(),
                task.getId()
        );
        taskRepository.delete(task);
    }

    @Override
    @Transactional
    public TaskResponseDto updateTask(User updater, UUID taskId, UUID projectId, UpdateTaskRequest request) {
        User managedUpdater = entityManager.merge(updater);
        Project project = projectService.getProjectById(projectId);
        checkIfUserIsMemberOfProject(updater, project);
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
                managedUpdater,
                "task;update;" + project.getName(),
                project.getId(),
                task.getId()
        );
        return taskMapper.toTaskResponseDto(updatedTask);
     }

    @Override
    public TaskResponseDto addUserToTask(User user, UUID taskId, UUID projectId, UserResponseDto request) {
        Project project = projectService.getProjectById(projectId);
        User userToAdd = userService.getUserByUsername(request.getUsername());
        checkIfUserIsMemberOfProject(user, project);
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
            return taskMapper.toTaskResponseDto(updatedTask);
        } else {
            throw new IllegalStateException("User is already a member of the task");
        }
    }

    @Override
    @Transactional
    public TaskResponseDto removeUserFromTask(User user, UUID taskId, UUID projectId, UserResponseDto request) {
        Project project = projectService.getProjectById(projectId);
        checkIfUserIsMemberOfProject(user, project);
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
            return taskMapper.toTaskResponseDto(updatedTask);
        } else {
            throw new UserNotInTaskException("User is not a member of the task");
        }
    }

    private void checkIfUserIsMemberOfProject(User user, Project project) {
        if (project.getMembers().stream().noneMatch(member -> member.getName().equals(user.getName()))) {
            throw new UserNotInProjectException("User " + user.getName() + " is not member of project");
        }
    }

}