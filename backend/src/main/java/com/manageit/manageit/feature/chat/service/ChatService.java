package com.manageit.manageit.feature.chat.service;

import com.manageit.manageit.feature.chat.model.Chat;
import com.manageit.manageit.feature.project.model.Project;
import com.manageit.manageit.feature.task.model.Task;

import java.util.UUID;

public interface ChatService {

    Chat getChatByTaskId(UUID taskId);

    Chat getChatByProjectIdAndTaskId(UUID projectId, UUID taskId);

    void saveChat(Project project, Task task);

    void saveChat(Project project);
}
