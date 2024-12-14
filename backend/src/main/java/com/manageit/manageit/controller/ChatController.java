package com.manageit.manageit.controller;

import com.manageit.manageit.dto.message.MessageDto;
import com.manageit.manageit.dto.message.WebSocketRequestMessage;
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
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.UUID;

@Controller
@RequiredArgsConstructor

public class ChatController {
    private final ChatService chatService;
    private final MessageService messageService;

    @MessageMapping("/projects/{projectId}")
    @SendTo("/join/projects/{projectId}")
    public MessageDto sendProjectMessage(
            @DestinationVariable UUID projectId,
            @Payload WebSocketRequestMessage requset
    ) {
        return messageService.saveMessageToProjectChat(projectId, requset.getToken(), requset.getContent());
    }

    @MessageMapping("/tasks/{taskId}")
    @SendTo("/join/tasks/{taskId}")
    public MessageDto sendTaskMessage(
            @DestinationVariable UUID taskId,
            @Payload WebSocketRequestMessage requset
//            SimpMessageHeaderAccessor headerAccessor
    ) {
//        Objects.requireNonNull(headerAccessor.getSessionAttributes()).put("username", message.getUser().getUsername());
        return messageService.saveMessageToTaskChat(taskId, requset.getToken(), requset.getContent());
    }




    @GetMapping("/chat/projects/{projectId}")
    public ResponseEntity<List<MessageDto>> getChatMessages(
        @PathVariable UUID projectId
    ) {
        Chat chat = chatService.getChatByProjectIdAndTaskId(projectId, null);
        return ResponseEntity.ok(messageService.getMessagesByChat(chat));
    }

    @GetMapping("/chat/projects/{projectId}/tasks/{taskId}")
    public ResponseEntity<List<MessageDto>> getChatMessages(
        @PathVariable UUID projectId,
        @PathVariable UUID taskId
    ) {
        Chat chat = chatService.getChatByProjectIdAndTaskId(projectId, taskId);
        System.out.println(chat);
        return ResponseEntity.ok(messageService.getMessagesByChat(chat));
    }
}
