package com.manageit.manageit.feature.message.service;

import com.manageit.manageit.feature.chat.model.Chat;
import com.manageit.manageit.feature.message.dto.MessageResponseDto;

import java.util.List;
import java.util.UUID;

public interface MessageService {

    List<MessageResponseDto> getMessagesByChat(Chat chat);

    MessageResponseDto saveMessageToProjectChat(UUID projectId, String token, String content);

    MessageResponseDto saveMessageToTaskChat(UUID taskId, String token, String content);
}
