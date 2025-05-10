package com.manageit.manageit.feature.message.service;

import com.manageit.manageit.feature.chat.model.Chat;
import com.manageit.manageit.feature.message.dto.MessageDto;

import java.util.List;
import java.util.UUID;

public interface MessageService {

    List<MessageDto> getMessagesByChat(Chat chat);

    MessageDto saveMessageToProjectChat(UUID projectId, String token, String content);

    MessageDto saveMessageToTaskChat(UUID taskId, String token, String content);
}
