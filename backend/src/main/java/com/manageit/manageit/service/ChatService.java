package com.manageit.manageit.service;

import com.manageit.manageit.model.chat.Chat;
import com.manageit.manageit.model.project.Project;
import com.manageit.manageit.model.task.Task;
import com.manageit.manageit.repository.ChatRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatRepository chatRepository;

    public Chat getChatById(UUID chatId) {
        return chatRepository.findById(chatId).orElseThrow(() -> new EntityNotFoundException("Chat not found"));
    }

    public Chat getChatByTaskId(
        UUID taskId
    ) {
        return chatRepository.findByTaskId(taskId).orElseThrow(() -> new EntityNotFoundException("Chat not found"));
    }

    public Chat getChatByProjectId(
            UUID projectId
    ) {
        return chatRepository.findByProjectId(projectId).orElseThrow(() -> new EntityNotFoundException("Chat not found"));
    }

    public Chat getChatByProjectIdAndTaskId(
            UUID projectId, UUID taskId
    ) {
        return  chatRepository.findByProjectIdAndTaskId(projectId, taskId).orElseThrow(() -> new EntityNotFoundException("Chat not found"));
    }

    public Chat saveChat(Project project, Task task) {
        return chatRepository.save(Chat.builder().project(project).task(task).build());
    }

    public Chat saveChat(Project project) {
        return chatRepository.save(Chat.builder().project(project).build());
    }
}
