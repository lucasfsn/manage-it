package com.manageit.manageit.controller;


import com.manageit.manageit.dto.project.ProjectDto;
import com.manageit.manageit.dto.project.ProjectRequest;
import com.manageit.manageit.dto.project.UpdateProjectRequest;
import com.manageit.manageit.dto.user.BasicUserDto;
import com.manageit.manageit.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<List<ProjectDto>> getProjects(
            @RequestHeader("Authorization") String token
    ) {
        return ResponseEntity.ok(projectService.getProjects(token));
    }

    @GetMapping("{projectId}")
    public ResponseEntity<ProjectDto> getProject(
            @PathVariable UUID projectId
    ) {
        return ResponseEntity.ok(projectService.getProject(projectId));
    }

    @PostMapping
    public ResponseEntity<ProjectDto> createProject(
            @RequestHeader("Authorization") String token,
            @Valid @RequestBody ProjectRequest projectRequest
    ) {
        ProjectDto project = projectService.createProject(token, projectRequest);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(project.getId())
                .toUri();

        return ResponseEntity.created(location).body(project);
    }

    @DeleteMapping("{projectId}")
    public ResponseEntity<Void> deleteProject(
            @RequestHeader("Authorization") String token,
            @PathVariable UUID projectId
    ) {
        projectService.deleteProject(token, projectId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("{projectId}")
    public ResponseEntity<Void> updateProject(
            @RequestHeader("Authorization") String token,
            @PathVariable UUID projectId,
            @Valid @RequestBody UpdateProjectRequest request
    ) {
        projectService.updateProject(token, projectId, request);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("{projectId}/user/add")
    public ResponseEntity<Void> addUserToProject(
            @RequestHeader("Authorization") String token,
            @PathVariable UUID projectId,
            @RequestBody BasicUserDto user

    ) {
        projectService.addUserToProject(token, projectId, user);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("{projectId}/user/remove")
    public ResponseEntity<Void> removeUserFromProject(
            @RequestHeader("Authorization") String token,
            @PathVariable UUID projectId,
            @RequestBody BasicUserDto user
    ) {
        projectService.removeUserFromProject(token, projectId, user);
        return ResponseEntity.noContent().build();
    }
}
