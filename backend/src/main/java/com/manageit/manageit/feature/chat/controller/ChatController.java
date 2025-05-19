package com.manageit.manageit.feature.chat.controller;

import com.manageit.manageit.feature.message.dto.MessageResponseDto;
import com.manageit.manageit.feature.message.dto.WebSocketRequestMessage;
import com.manageit.manageit.feature.chat.model.Chat;
import com.manageit.manageit.feature.chat.service.ChatService;
import com.manageit.manageit.feature.message.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.UUID;

@Controller
@RequiredArgsConstructor

public class ChatController {
    private final ChatService chatService;
    private final MessageService messageService;

    @MessageMapping("/projects/{projectId}")
    @SendTo("/join/projects/{projectId}")
    public MessageResponseDto sendProjectMessage(
            @DestinationVariable UUID projectId,
            @Payload WebSocketRequestMessage request
    ) {
        return messageService.saveMessageToProjectChat(projectId, request.getToken(), request.getContent());
    }

    @MessageMapping("/tasks/{taskId}")
    @SendTo("/join/tasks/{taskId}")
    public MessageResponseDto sendTaskMessage(
            @DestinationVariable UUID taskId,
            @Payload WebSocketRequestMessage requset
    ) {
        return messageService.saveMessageToTaskChat(taskId, requset.getToken(), requset.getContent());
    }




    @GetMapping("/chat/projects/{projectId}")
    public ResponseEntity<List<MessageResponseDto>> getChatMessages(
        @PathVariable UUID projectId
    ) {
        Chat chat = chatService.getChatByProjectIdAndTaskId(projectId, null);
        return ResponseEntity.ok(messageService.getMessagesByChat(chat));
    }

    @GetMapping("/chat/projects/{projectId}/tasks/{taskId}")
    public ResponseEntity<List<MessageResponseDto>> getChatMessages(
        @PathVariable UUID projectId,
        @PathVariable UUID taskId
    ) {
        Chat chat = chatService.getChatByProjectIdAndTaskId(projectId, taskId);
        return ResponseEntity.ok(messageService.getMessagesByChat(chat));
    }
}
