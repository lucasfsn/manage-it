package com.manageit.manageit.feature.project.repository;

import com.manageit.manageit.feature.project.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProjectRepository extends JpaRepository<Project, UUID> {
    Optional<List<Project>> findByMembers_Username(String username);
}
