package com.manageit.manageit.feature.task.service;

import com.manageit.manageit.feature.task.dto.CreateTaskRequest;
import com.manageit.manageit.feature.task.dto.TaskDto;
import com.manageit.manageit.feature.task.dto.TaskMetadataDto;
import com.manageit.manageit.feature.task.dto.UpdateTaskRequest;
import com.manageit.manageit.feature.task.model.Task;
import com.manageit.manageit.feature.user.dto.BasicUserDto;
import com.manageit.manageit.feature.user.model.User;

import java.util.UUID;

public interface TaskService {
    Task getTaskById(UUID id);

    TaskDto getTask(User user, UUID projectId, UUID taskId);

    TaskMetadataDto createAndAddTaskToProject(User owner, UUID projectId, CreateTaskRequest createTaskRequest);

    void deleteTask(User user, UUID taskId, UUID projectId);

    TaskDto updateTask(User updater, UUID taskId, UUID projectId, UpdateTaskRequest request);

    TaskDto addUserToTask(User user, UUID taskId, UUID projectId, BasicUserDto request);

    TaskDto removeUserFromTask(User user, UUID taskId, UUID projectId, BasicUserDto request);
}
