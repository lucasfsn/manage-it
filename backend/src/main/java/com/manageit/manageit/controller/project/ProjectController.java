package com.manageit.manageit.controller.project;


import com.manageit.manageit.dto.project.ProjectDto;
import com.manageit.manageit.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

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
}
