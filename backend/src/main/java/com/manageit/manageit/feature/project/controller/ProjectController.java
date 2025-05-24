package com.manageit.manageit.feature.project.controller;


import com.manageit.manageit.feature.project.dto.ProjectResponseDto;
import com.manageit.manageit.feature.project.dto.CreateProjectRequestDto;
import com.manageit.manageit.feature.project.dto.UpdateProjectRequestDto;
import com.manageit.manageit.feature.user.dto.UserResponseDto;
import com.manageit.manageit.feature.user.model.User;
import com.manageit.manageit.feature.project.service.ProjectService;
import com.manageit.manageit.shared.dto.ResponseDto;
import com.manageit.manageit.shared.enums.SuccessCode;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/projects")
public class ProjectController {

    private final ProjectService projectService;

    @GetMapping
    public ResponseDto<List<ProjectResponseDto>> getProjects(
            @AuthenticationPrincipal User userDetails
    ) {
        return new ResponseDto<>(
                SuccessCode.RESPONSE_SUCCESSFUL,
                "Projects found successfully",
                projectService.getProjects(userDetails)
        );
    }

    @GetMapping("{projectId}")
    public ResponseDto<ProjectResponseDto> getProject(
            @AuthenticationPrincipal User userDetails,
            @PathVariable UUID projectId
    ) {
        return new ResponseDto<>(
                SuccessCode.RESPONSE_SUCCESSFUL,
                "Project found successfully with id: " + projectId,
                projectService.getProject(projectId, userDetails)
        );
    }

    @PostMapping
    public ResponseEntity<ResponseDto<ProjectResponseDto>> createProject(
            @AuthenticationPrincipal User userDetails,
            @Valid @RequestBody CreateProjectRequestDto createProjectRequest
    ) {
        ProjectResponseDto project = projectService.createProject(userDetails, createProjectRequest);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(project.getId())
                .toUri();

        return ResponseEntity.created(location).body(new ResponseDto<>(
                SuccessCode.RESOURCE_CREATED,
                "Project created successfully",
                project
        ));
    }

    @DeleteMapping("{projectId}")
    public ResponseEntity<ResponseDto<Void>> deleteProject(
            @AuthenticationPrincipal User userDetails,
            @PathVariable UUID projectId
    ) {
        projectService.deleteProject(userDetails, projectId);
        return ResponseEntity.ok(
                new ResponseDto<>(
                        SuccessCode.RESOURCE_DELETED,
                        "Project deleted successfully with id: " + projectId,
                        null
                )
        );
    }

    @PatchMapping("{projectId}")
    public ResponseDto<ProjectResponseDto> updateProject(
            @AuthenticationPrincipal User userDetails,
            @PathVariable UUID projectId,
            @Valid @RequestBody UpdateProjectRequestDto request
    ) {
        ProjectResponseDto updatedProject = projectService.updateProject(userDetails, projectId, request);
        return new ResponseDto<>(
                SuccessCode.RESOURCE_UPDATED,
                "Project updated successfully",
                updatedProject
        );
    }

    @PatchMapping("{projectId}/user/add")
    public ResponseDto<ProjectResponseDto> addUserToProject(
            @AuthenticationPrincipal User userDetails,
            @PathVariable UUID projectId,
            @RequestBody UserResponseDto user

    ) {
        return new ResponseDto<>(
                SuccessCode.RESOURCE_UPDATED,
                "User added to project successfully",
                projectService.addUserToProject(userDetails, projectId, user)
        );
    }

    @PatchMapping("{projectId}/user/remove")
    public ResponseDto<ProjectResponseDto> removeUserFromProject(
            @AuthenticationPrincipal User userDetails,
            @PathVariable UUID projectId,
            @RequestBody UserResponseDto user
    ) {
        return new ResponseDto<>(
                SuccessCode.RESOURCE_UPDATED,
                "User removed from project successfully",
                projectService.removeUserFromProject(userDetails, projectId, user)
        );
    }
}
