package com.manageit.manageit.feature.project.controller;


import com.manageit.manageit.feature.project.dto.ProjectResponseDto;
import com.manageit.manageit.feature.project.dto.CreateProjectRequest;
import com.manageit.manageit.feature.project.dto.UpdateProjectRequest;
import com.manageit.manageit.feature.user.dto.UserResponseDto;
import com.manageit.manageit.feature.user.model.User;
import com.manageit.manageit.feature.project.service.ProjectService;
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
    public ResponseEntity<List<ProjectResponseDto>> getProjects(
            @AuthenticationPrincipal User userDetails
    ) {
        return ResponseEntity.ok(projectService.getProjects(userDetails));
    }

    @GetMapping("{projectId}")
    public ResponseEntity<ProjectResponseDto> getProject(
            @AuthenticationPrincipal User userDetails,
            @PathVariable UUID projectId
    ) {
        return ResponseEntity.ok(projectService.getProject(projectId, userDetails));
    }

    @PostMapping
    public ResponseEntity<ProjectResponseDto> createProject(
            @AuthenticationPrincipal User userDetails,
            @Valid @RequestBody CreateProjectRequest createProjectRequest
    ) {
        ProjectResponseDto project = projectService.createProject(userDetails, createProjectRequest);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(project.getId())
                .toUri();

        return ResponseEntity.created(location).body(project);
    }

    @DeleteMapping("{projectId}")
    public ResponseEntity<Void> deleteProject(
            @AuthenticationPrincipal User userDetails,
            @PathVariable UUID projectId
    ) {
        projectService.deleteProject(userDetails, projectId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("{projectId}")
    public ResponseEntity<ProjectResponseDto> updateProject(
            @AuthenticationPrincipal User userDetails,
            @PathVariable UUID projectId,
            @Valid @RequestBody UpdateProjectRequest request
    ) {
        ProjectResponseDto updatedProject = projectService.updateProject(userDetails, projectId, request);
        return ResponseEntity.ok(updatedProject);
    }

    @PatchMapping("{projectId}/user/add")
    public ResponseEntity<Void> addUserToProject(
            @AuthenticationPrincipal User userDetails,
            @PathVariable UUID projectId,
            @RequestBody UserResponseDto user

    ) {
        projectService.addUserToProject(userDetails, projectId, user);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("{projectId}/user/remove")
    public ResponseEntity<ProjectResponseDto> removeUserFromProject(
            @AuthenticationPrincipal User userDetails,
            @PathVariable UUID projectId,
            @RequestBody UserResponseDto user
    ) {
        ProjectResponseDto updatedProject = projectService.removeUserFromProject(userDetails, projectId, user);
        return ResponseEntity.ok(updatedProject);
    }
}
