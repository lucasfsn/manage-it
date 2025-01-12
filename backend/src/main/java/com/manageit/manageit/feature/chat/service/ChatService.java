package com.manageit.manageit.feature.chat.service;

import com.manageit.manageit.feature.chat.model.Chat;
import com.manageit.manageit.feature.project.model.Project;
import com.manageit.manageit.feature.task.model.Task;
import com.manageit.manageit.feature.chat.repository.ChatRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatRepository chatRepository;

    public Chat getChatByTaskId(
        UUID taskId
    ) {
        return chatRepository.findByTaskId(taskId).orElseThrow(() -> new EntityNotFoundException("Chat not found"));
    }


    public Chat getChatByProjectIdAndTaskId(
            UUID projectId, UUID taskId
    ) {
        return  chatRepository.findByProjectIdAndTaskId(projectId, taskId).orElseThrow(() -> new EntityNotFoundException("Chat not found"));
    }

    public void saveChat(Project project, Task task) {
        chatRepository.save(Chat.builder().project(project).task(task).build());
    }

    public void saveChat(Project project) {
        chatRepository.save(Chat.builder().project(project).build());
    }
}
