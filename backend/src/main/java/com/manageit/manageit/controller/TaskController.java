package com.manageit.manageit.controller;

import com.manageit.manageit.dto.task.CreateTaskRequest;
import com.manageit.manageit.dto.task.TaskDto;
import com.manageit.manageit.dto.task.TaskMetadataDto;
import com.manageit.manageit.dto.task.UpdateTaskRequest;
import com.manageit.manageit.dto.user.BasicUserDto;
import com.manageit.manageit.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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
            @RequestHeader("Authorization") String token,
            @PathVariable UUID taskId,
            @PathVariable UUID projectId
    ) {
        return ResponseEntity.ok(taskService.getTask(token, projectId, taskId));
    }

    @PostMapping
    public ResponseEntity<TaskMetadataDto> addTaskToProject(
            @RequestHeader("Authorization") String token,
            @PathVariable UUID projectId,
            @RequestBody CreateTaskRequest createTaskRequest
    ) {
        TaskMetadataDto task = taskService.createAndAddTaskToProject(token, projectId ,createTaskRequest);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(task.getId())
                .toUri();
        return ResponseEntity.created(location).body(task);
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<Void> removeTask(
            @RequestHeader("Authorization") String token,
            @PathVariable UUID taskId,
            @PathVariable UUID projectId
    ) {
        taskService.deleteTask(token, taskId, projectId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{taskId}")
    public ResponseEntity<TaskDto> updateTask(
            @RequestHeader("Authorization") String token,
            @PathVariable UUID taskId,
            @PathVariable UUID projectId,
            @RequestBody UpdateTaskRequest updateTaskRequest
    ) {
        TaskDto updatedTask = taskService.updateTask(token, taskId, projectId, updateTaskRequest);
        return ResponseEntity.ok(updatedTask);
    }

    @PatchMapping("/{taskId}/user/add")
    public ResponseEntity<TaskDto> addUserToTask(
            @RequestHeader("Authorization") String token,
            @PathVariable UUID taskId,
            @PathVariable UUID projectId,
            @RequestBody BasicUserDto request
    ) {
        TaskDto updatedTask = taskService.addUserToTask(token, taskId, projectId, request);
        return ResponseEntity.ok(updatedTask);
    }

    @PatchMapping("/{taskId}/user/remove")
    public ResponseEntity<TaskDto> removeUserFromProject(
            @RequestHeader("Authorization") String token,
            @PathVariable UUID taskId,
            @PathVariable UUID projectId,
            @RequestBody BasicUserDto request
    ) {
        TaskDto updatedTask = taskService.removeUserFromTask(token, taskId, projectId, request);
        return ResponseEntity.ok(updatedTask);
    }

}
