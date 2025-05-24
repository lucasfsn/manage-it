package com.manageit.manageit.feature.task.controller;

import com.manageit.manageit.feature.task.dto.CreateTaskRequestDto;
import com.manageit.manageit.feature.task.dto.TaskResponseDto;
import com.manageit.manageit.feature.task.dto.TaskDetailsResponseDto;
import com.manageit.manageit.feature.task.dto.UpdateTaskRequestDto;
import com.manageit.manageit.feature.user.dto.UserResponseDto;
import com.manageit.manageit.feature.user.model.User;
import com.manageit.manageit.feature.task.service.TaskService;
import com.manageit.manageit.shared.dto.ResponseDto;
import com.manageit.manageit.shared.enums.SuccessCode;
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
    public ResponseDto<TaskResponseDto> getTask(
            @AuthenticationPrincipal User userDetails,
            @PathVariable UUID taskId,
            @PathVariable UUID projectId
    ) {
        return new ResponseDto<>(
                SuccessCode.RESPONSE_SUCCESSFUL,
                "Task found successfully with id: " + taskId,
                taskService.getTask(userDetails, projectId, taskId)
        );
    }

    @PostMapping
    public ResponseEntity<ResponseDto<TaskDetailsResponseDto>> addTaskToProject(
            @AuthenticationPrincipal User userDetails,
            @PathVariable UUID projectId,
            @Valid @RequestBody CreateTaskRequestDto createTaskRequest
    ) {
        TaskDetailsResponseDto task = taskService.createAndAddTaskToProject(userDetails, projectId ,createTaskRequest);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(task.getId())
                .toUri();
        return ResponseEntity.created(location).body(
                new ResponseDto<>(
                        SuccessCode.RESOURCE_CREATED,
                        "Task created and added to project successfully",
                        task
                )
        );
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<ResponseDto<Void>> removeTask(
            @AuthenticationPrincipal User userDetails,
            @PathVariable UUID taskId,
            @PathVariable UUID projectId
    ) {
        taskService.deleteTask(userDetails, taskId, projectId);
        return ResponseEntity.ok(
                new ResponseDto<>(
                        SuccessCode.RESOURCE_DELETED,
                        "Task deleted successfully with id: " + taskId,
                        null
                )
        );
    }

    @PatchMapping("/{taskId}")
    public ResponseDto<TaskResponseDto> updateTask(
            @AuthenticationPrincipal User userDetails,
            @PathVariable UUID taskId,
            @PathVariable UUID projectId,
            @Valid @RequestBody UpdateTaskRequestDto updateTaskRequest
    ) {
        TaskResponseDto updatedTask = taskService.updateTask(userDetails, taskId, projectId, updateTaskRequest);
        return new ResponseDto<>(
                SuccessCode.RESOURCE_UPDATED,
                "Task updated successfully with id: " + taskId,
                updatedTask
        );
    }

    @PatchMapping("/{taskId}/user/add")
    public ResponseDto<TaskResponseDto> addUserToTask(
            @AuthenticationPrincipal User userDetails,
            @PathVariable UUID taskId,
            @PathVariable UUID projectId,
            @RequestBody UserResponseDto request
    ) {
        TaskResponseDto updatedTask = taskService.addUserToTask(userDetails, taskId, projectId, request);
        return new ResponseDto<>(
                SuccessCode.RESOURCE_UPDATED,
                "User added to task successfully with id: " + taskId,
                updatedTask
        );
    }

    @PatchMapping("/{taskId}/user/remove")
    public ResponseDto<TaskResponseDto> removeUserFromProject(
            @AuthenticationPrincipal User userDetails,
            @PathVariable UUID taskId,
            @PathVariable UUID projectId,
            @RequestBody UserResponseDto request
    ) {
        TaskResponseDto updatedTask = taskService.removeUserFromTask(userDetails, taskId, projectId, request);
        return new ResponseDto<>(
                SuccessCode.RESOURCE_UPDATED,
                "User removed from task successfully with id: " + taskId,
                updatedTask
        );
    }

}
