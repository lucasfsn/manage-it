package com.manageit.manageit.controller;

import com.manageit.manageit.dto.message.MessageDto;
import com.manageit.manageit.model.chat.Chat;
import com.manageit.manageit.service.ChatService;
import com.manageit.manageit.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

import java.util.List;
import java.util.UUID;

@Controller
@RequiredArgsConstructor

public class ChatController {
    private final ChatService chatService;
    private final MessageService messageService;

    @MessageMapping("/projects/{projectId}/chat/send")
    @SendTo("/topic/projects/{projectId}/chat")
    public MessageDto sendProjectMessage(
            @DestinationVariable UUID projectId,
            @RequestHeader("Authorization") String token,
            @Payload MessageDto message
    ) {
        return messageService.saveMessageToProjectChat(projectId, token, message);
    }

    @MessageMapping("/tasks/{taskId}/chat/send")
    @SendTo("/topic/tasks/{taskId}/chat")
    public MessageDto sendTaskMessage(
            @DestinationVariable UUID taskId,
            @RequestHeader("Authorization") String token,
            @Payload MessageDto message
//            SimpMessageHeaderAccessor headerAccessor
    ) {
//        Objects.requireNonNull(headerAccessor.getSessionAttributes()).put("username", message.getUser().getUsername());
        return messageService.saveMessageToTaskChat(taskId, token, message);
    }




    @GetMapping("/chat/{chatId}/messages")
    public ResponseEntity<List<MessageDto>> getChatMessages(
        @PathVariable UUID chatId
    ) {
        Chat chat = chatService.getChatById(chatId);
        return ResponseEntity.ok(messageService.getMessagesByChat(chat));
    }
}
