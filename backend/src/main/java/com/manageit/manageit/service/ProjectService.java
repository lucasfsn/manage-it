package com.manageit.manageit.service;

import com.manageit.manageit.dto.project.ProjectDto;
import com.manageit.manageit.mapper.project.ProjectMapper;
import com.manageit.manageit.repository.ProjectRepository;
import com.manageit.manageit.repository.UserRepository;
import com.manageit.manageit.security.JwtService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final JwtService jwtService;
    private final ProjectRepository projectRepository;
    private final ProjectMapper projectMapper;

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
}
