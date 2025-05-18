package com.manageit.manageit.feature.task.controller;

import com.manageit.manageit.feature.task.dto.CreateTaskRequest;
import com.manageit.manageit.feature.task.dto.TaskDto;
import com.manageit.manageit.feature.task.dto.TaskMetadataDto;
import com.manageit.manageit.feature.task.dto.UpdateTaskRequest;
import com.manageit.manageit.feature.user.dto.BasicUserDto;
import com.manageit.manageit.feature.user.model.User;
import com.manageit.manageit.feature.task.service.TaskService;
import jakarta.validation.Valid;
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
    public ResponseEntity<TaskDto> getTask(
            @AuthenticationPrincipal User userDetails,
            @PathVariable UUID taskId,
            @PathVariable UUID projectId
    ) {
        return ResponseEntity.ok(taskService.getTask(userDetails, projectId, taskId));
    }

    @PostMapping
    public ResponseEntity<TaskMetadataDto> addTaskToProject(
            @AuthenticationPrincipal User userDetails,
            @PathVariable UUID projectId,
            @Valid @RequestBody CreateTaskRequest createTaskRequest
    ) {
        TaskMetadataDto task = taskService.createAndAddTaskToProject(userDetails, projectId ,createTaskRequest);
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
    public ResponseEntity<TaskDto> updateTask(
            @AuthenticationPrincipal User userDetails,
            @PathVariable UUID taskId,
            @PathVariable UUID projectId,
            @Valid @RequestBody UpdateTaskRequest updateTaskRequest
    ) {
        TaskDto updatedTask = taskService.updateTask(userDetails, taskId, projectId, updateTaskRequest);
        return ResponseEntity.ok(updatedTask);
    }

    @PatchMapping("/{taskId}/user/add")
    public ResponseEntity<TaskDto> addUserToTask(
            @AuthenticationPrincipal User userDetails,
            @PathVariable UUID taskId,
            @PathVariable UUID projectId,
            @RequestBody BasicUserDto request
    ) {
        TaskDto updatedTask = taskService.addUserToTask(userDetails, taskId, projectId, request);
        return ResponseEntity.ok(updatedTask);
    }

    @PatchMapping("/{taskId}/user/remove")
    public ResponseEntity<TaskDto> removeUserFromProject(
            @AuthenticationPrincipal User userDetails,
            @PathVariable UUID taskId,
            @PathVariable UUID projectId,
            @RequestBody BasicUserDto request
    ) {
        TaskDto updatedTask = taskService.removeUserFromTask(userDetails, taskId, projectId, request);
        return ResponseEntity.ok(updatedTask);
    }

}
