package com.manageit.manageit.feature.task.repository;

import com.manageit.manageit.feature.task.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface TaskRepository extends JpaRepository<Task, UUID> {
}
