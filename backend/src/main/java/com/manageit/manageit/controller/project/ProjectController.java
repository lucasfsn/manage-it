package com.manageit.manageit.controller.project;


import com.manageit.manageit.dto.project.ProjectDto;
import com.manageit.manageit.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
}
