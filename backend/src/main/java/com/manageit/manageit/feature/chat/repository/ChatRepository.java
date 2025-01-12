package com.manageit.manageit.feature.chat.repository;

import com.manageit.manageit.feature.chat.model.Chat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ChatRepository extends JpaRepository<Chat, UUID> {
    Optional<Chat> findByProjectId(UUID projectId);
    Optional<Chat> findByTaskId(UUID taskId);
    Optional<Chat> findByProjectIdAndTaskId(UUID projectId, UUID taskId);
}
