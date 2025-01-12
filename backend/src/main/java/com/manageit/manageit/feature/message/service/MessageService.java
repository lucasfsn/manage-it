package com.manageit.manageit.feature.message.service;

import com.manageit.manageit.feature.message.dto.MessageDto;
import com.manageit.manageit.feature.user.service.UserService;
import com.manageit.manageit.feature.message.mapper.MessageMapper;
import com.manageit.manageit.feature.chat.model.Chat;
import com.manageit.manageit.feature.message.model.Message;
import com.manageit.manageit.feature.message.repository.MessageRepository;
import com.manageit.manageit.feature.chat.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final ChatService chatService;
    private final UserService userService;
    private final MessageMapper messageMapper;


    public List<MessageDto> getMessagesByChat(Chat chat) {
        return chat.getMessages().stream().map(messageMapper::toMessageDto).toList();
    }

    public MessageDto saveMessageToProjectChat(UUID projectId, String token, String content) {
        Chat chat = chatService.getChatByProjectIdAndTaskId(projectId, null);
        Message message = Message.builder()
                .chat(chat)
                .user(userService.getUserByToken(token))
                .content(content)
                .createdAt(LocalDateTime.now())
                .build();
        messageRepository.save(message);
        return messageMapper.toMessageDto(message);
    }

    public MessageDto saveMessageToTaskChat(UUID taskId, String token, String content) {
        Chat chat = chatService.getChatByTaskId(taskId);
        Message message = Message.builder()
                .chat(chat)
                .user(userService.getUserByToken(token))
                .content(content)
                .createdAt(LocalDateTime.now())
                .build();
        messageRepository.save(message);
        return messageMapper.toMessageDto(message);
    }

}
