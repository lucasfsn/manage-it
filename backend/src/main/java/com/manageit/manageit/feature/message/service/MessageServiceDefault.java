package com.manageit.manageit.feature.message.service;

import com.manageit.manageit.feature.message.dto.MessageResponseDto;
import com.manageit.manageit.feature.user.service.UserService;
import com.manageit.manageit.feature.message.mapper.MessageMapper;
import com.manageit.manageit.feature.chat.model.Chat;
import com.manageit.manageit.feature.message.model.Message;
import com.manageit.manageit.feature.message.repository.MessageRepository;
import com.manageit.manageit.feature.chat.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MessageServiceDefault implements MessageService {

    private final MessageRepository messageRepository;
    private final ChatService chatService;
    private final UserService userService;
    private final MessageMapper messageMapper;


    @Override
    public List<MessageResponseDto> getMessagesByChat(Chat chat) {
        return chat.getMessages().stream().map(messageMapper::toMessageDto).toList();
    }

    @Override
    public MessageResponseDto saveMessageToProjectChat(UUID projectId, String token, String content) {
        Chat chat = chatService.getChatByProjectIdAndTaskId(projectId, null);
        Message message = Message.builder()
                .chat(chat)
                .user(userService.getUserByToken(token))
                .content(content)
                .createdAt(OffsetDateTime.now(ZoneOffset.UTC))
                .build();
        messageRepository.save(message);
        return messageMapper.toMessageDto(message);
    }

    @Override
    public MessageResponseDto saveMessageToTaskChat(UUID taskId, String token, String content) {
        Chat chat = chatService.getChatByTaskId(taskId);
        Message message = Message.builder()
                .chat(chat)
                .user(userService.getUserByToken(token))
                .content(content)
                .createdAt(OffsetDateTime.now(ZoneOffset.UTC))
                .build();
        messageRepository.save(message);
        return messageMapper.toMessageDto(message);
    }

}
