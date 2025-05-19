package com.manageit.manageit.feature.task.service;

import com.manageit.manageit.feature.task.dto.CreateTaskRequestDto;
import com.manageit.manageit.feature.task.dto.TaskDetailsResponseDto;
import com.manageit.manageit.feature.task.dto.TaskResponseDto;
import com.manageit.manageit.feature.task.dto.UpdateTaskRequestDto;
import com.manageit.manageit.feature.task.model.Task;
import com.manageit.manageit.feature.user.dto.UserResponseDto;
import com.manageit.manageit.feature.user.model.User;

import java.util.UUID;

public interface TaskService {

    Task getTaskById(UUID id);

    TaskResponseDto getTask(User user, UUID projectId, UUID taskId);

    TaskDetailsResponseDto createAndAddTaskToProject(User owner, UUID projectId, CreateTaskRequestDto createTaskRequest);

    void deleteTask(User user, UUID taskId, UUID projectId);

    TaskResponseDto updateTask(User updater, UUID taskId, UUID projectId, UpdateTaskRequestDto request);

    TaskResponseDto addUserToTask(User user, UUID taskId, UUID projectId, UserResponseDto request);

    TaskResponseDto removeUserFromTask(User user, UUID taskId, UUID projectId, UserResponseDto request);

}
