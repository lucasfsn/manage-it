package com.manageit.manageit.feature.task.controller;

import com.manageit.manageit.feature.task.dto.CreateTaskRequest;
import com.manageit.manageit.feature.task.dto.TaskResponseDto;
import com.manageit.manageit.feature.task.dto.TaskDetailsResponseDto;
import com.manageit.manageit.feature.task.dto.UpdateTaskRequest;
import com.manageit.manageit.feature.user.dto.UserResponseDto;
import com.manageit.manageit.feature.user.model.User;
import com.manageit.manageit.feature.task.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.UUID;

@RestController
@RequestMapping("/projects/{projectId}/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @GetMapping("/{taskId}")
    public ResponseEntity<TaskResponseDto> getTask(
            @AuthenticationPrincipal User userDetails,
            @PathVariable UUID taskId,
            @PathVariable UUID projectId
    ) {
        return ResponseEntity.ok(taskService.getTask(userDetails, projectId, taskId));
    }

    @PostMapping
    public ResponseEntity<TaskDetailsResponseDto> addTaskToProject(
            @AuthenticationPrincipal User userDetails,
            @PathVariable UUID projectId,
            @RequestBody CreateTaskRequest createTaskRequest
    ) {
        TaskDetailsResponseDto task = taskService.createAndAddTaskToProject(userDetails, projectId ,createTaskRequest);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(task.getId())
                .toUri();
        return ResponseEntity.created(location).body(task);
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<Void> removeTask(
            @AuthenticationPrincipal User userDetails,
            @PathVariable UUID taskId,
            @PathVariable UUID projectId
    ) {
        taskService.deleteTask(userDetails, taskId, projectId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{taskId}")
    public ResponseEntity<TaskResponseDto> updateTask(
            @AuthenticationPrincipal User userDetails,
            @PathVariable UUID taskId,
            @PathVariable UUID projectId,
            @RequestBody UpdateTaskRequest updateTaskRequest
    ) {
        TaskResponseDto updatedTask = taskService.updateTask(userDetails, taskId, projectId, updateTaskRequest);
        return ResponseEntity.ok(updatedTask);
    }

    @PatchMapping("/{taskId}/user/add")
    public ResponseEntity<TaskResponseDto> addUserToTask(
            @AuthenticationPrincipal User userDetails,
            @PathVariable UUID taskId,
            @PathVariable UUID projectId,
            @RequestBody UserResponseDto request
    ) {
        TaskResponseDto updatedTask = taskService.addUserToTask(userDetails, taskId, projectId, request);
        return ResponseEntity.ok(updatedTask);
    }

    @PatchMapping("/{taskId}/user/remove")
    public ResponseEntity<TaskResponseDto> removeUserFromProject(
            @AuthenticationPrincipal User userDetails,
            @PathVariable UUID taskId,
            @PathVariable UUID projectId,
            @RequestBody UserResponseDto request
    ) {
        TaskResponseDto updatedTask = taskService.removeUserFromTask(userDetails, taskId, projectId, request);
        return ResponseEntity.ok(updatedTask);
    }

}
