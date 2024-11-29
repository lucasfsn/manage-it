package com.manageit.manageit.service;

import com.manageit.manageit.dto.project.ProjectDto;
import com.manageit.manageit.dto.project.ProjectRequest;
import com.manageit.manageit.mapper.project.ProjectMapper;
import com.manageit.manageit.project.Project;
import com.manageit.manageit.project.ProjectStatus;
import com.manageit.manageit.repository.ProjectRepository;
import com.manageit.manageit.repository.UserRepository;
import com.manageit.manageit.security.JwtService;
import com.manageit.manageit.user.User;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final JwtService jwtService;
    private final ProjectRepository projectRepository;
    private final ProjectMapper projectMapper;
    private final UserRepository userRepository;

    public List<ProjectDto> getProjects(String token) {
        String username = jwtService.extractUsername(token.replace("Bearer ", ""));
        return projectRepository.findByMembers_Username(username)
                .map(projects -> projects.stream()
                        .map(projectMapper::toProjectDto)
                        .toList())
                .orElseThrow(() -> new EntityNotFoundException("No projects found"));
    }

    public ProjectDto getProject(UUID id) {
        return projectRepository.findById(id)
                .map(projectMapper::toProjectDto)
                .orElseThrow(() -> new EntityNotFoundException("No project found with id: " + id));
    }

    public UUID createProject(String token, ProjectRequest projectRequest) {
        String username = jwtService.extractUsername(token.replace("Bearer ", ""));
        User owner = userRepository.findByUsername(username).orElseThrow(() -> new EntityNotFoundException("No user found with username: " + username));
        Project project = Project.builder()
                .owner(owner)
                .name(projectRequest.getName())
                .description(projectRequest.getDescription())
                .status(ProjectStatus.IN_PROGRESS)
                .startDate(projectRequest.getStartDate())
                .endDate(projectRequest.getEndDate())
                .createdAt(LocalDateTime.now())
                .members(List.of(owner))
                .build();
        projectRepository.save(project);
        return project.getId();

    }
}
