package com.manageit.manageit.repository;

import com.manageit.manageit.model.chat.Chat;
import com.manageit.manageit.model.project.Project;
import com.manageit.manageit.model.task.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ChatRepository extends JpaRepository<Chat, UUID> {
    Optional<Chat> findByProjectId(UUID projectId);
    Optional<Chat> findByTaskId(UUID taskId);
}
