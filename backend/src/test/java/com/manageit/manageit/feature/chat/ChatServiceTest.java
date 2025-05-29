package com.manageit.manageit.feature.chat;

import com.manageit.manageit.feature.chat.model.Chat;
import com.manageit.manageit.feature.chat.repository.ChatRepository;
import com.manageit.manageit.feature.chat.service.ChatServiceDefault;
import com.manageit.manageit.feature.project.model.Project;
import com.manageit.manageit.feature.task.model.Task;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ChatServiceTest {

    @Mock
    private ChatRepository chatRepository;

    @InjectMocks
    private ChatServiceDefault chatService;

    private Project testProject;
    private Task testTask;
    private Chat testChat;
    private UUID projectId;
    private UUID taskId;

    @BeforeEach
    void setUp() {
        projectId = UUID.randomUUID();
        taskId = UUID.randomUUID();
        UUID chatId = UUID.randomUUID();

        testProject = Project.builder()
                .id(projectId)
                .name("Test Project")
                .build();

        testTask = Task.builder()
                .id(taskId)
                .project(testProject)
                .description("Test Task")
                .build();

        testChat = Chat.builder()
                .id(chatId)
                .project(testProject)
                .task(testTask)
                .build();
    }

    @Test
    void getChatByTaskId_WhenChatExists_ShouldReturnChat() {
        when(chatRepository.findByTaskId(taskId)).thenReturn(Optional.of(testChat));

        Chat result = chatService.getChatByTaskId(taskId);

        assertNotNull(result);
        assertEquals(testChat, result);
        verify(chatRepository).findByTaskId(taskId);
    }

    @Test
    void getChatByTaskId_WhenChatNotExists_ShouldThrowEntityNotFoundException() {
        when(chatRepository.findByTaskId(taskId)).thenReturn(Optional.empty());

        EntityNotFoundException exception = assertThrows(
                EntityNotFoundException.class,
                () -> chatService.getChatByTaskId(taskId)
        );
        assertEquals("Chat not found", exception.getMessage());
        verify(chatRepository).findByTaskId(taskId);
    }

    @Test
    void getChatByProjectIdAndTaskId_WhenChatExists_ShouldReturnChat() {
        when(chatRepository.findByProjectIdAndTaskId(projectId, taskId)).thenReturn(Optional.of(testChat));

        Chat result = chatService.getChatByProjectIdAndTaskId(projectId, taskId);

        assertNotNull(result);
        assertEquals(testChat, result);
        verify(chatRepository).findByProjectIdAndTaskId(projectId, taskId);
    }

    @Test
    void getChatByProjectIdAndTaskId_WhenChatNotExists_ShouldThrowEntityNotFoundException() {
        when(chatRepository.findByProjectIdAndTaskId(projectId, taskId)).thenReturn(Optional.empty());

        EntityNotFoundException exception = assertThrows(
                EntityNotFoundException.class,
                () -> chatService.getChatByProjectIdAndTaskId(projectId, taskId)
        );
        assertEquals("Chat not found", exception.getMessage());
        verify(chatRepository).findByProjectIdAndTaskId(projectId, taskId);
    }

    @Test
    void saveChat_WhenProjectAndTask_ShouldSaveChatWithBothEntities() {
        ArgumentCaptor<Chat> chatCaptor = ArgumentCaptor.forClass(Chat.class);

        chatService.saveChat(testProject, testTask);

        verify(chatRepository).save(chatCaptor.capture());
        Chat savedChat = chatCaptor.getValue();
        assertNotNull(savedChat);
        assertEquals(testProject, savedChat.getProject());
        assertEquals(testTask, savedChat.getTask());
    }

    @Test
    void saveChat_WhenOnlyProject_ShouldSaveChatWithProjectOnly() {
        ArgumentCaptor<Chat> chatCaptor = ArgumentCaptor.forClass(Chat.class);

        chatService.saveChat(testProject);

        verify(chatRepository).save(chatCaptor.capture());
        Chat savedChat = chatCaptor.getValue();
        assertNotNull(savedChat);
        assertEquals(testProject, savedChat.getProject());
        assertNull(savedChat.getTask());
    }

    @Test
    void saveChat_WhenNullProject_ShouldSaveChatWithNullProject() {
        ArgumentCaptor<Chat> chatCaptor = ArgumentCaptor.forClass(Chat.class);

        chatService.saveChat(null, testTask);

        verify(chatRepository).save(chatCaptor.capture());
        Chat savedChat = chatCaptor.getValue();
        assertNotNull(savedChat);
        assertNull(savedChat.getProject());
        assertEquals(testTask, savedChat.getTask());
    }

    @Test
    void saveChat_WhenNullTask_ShouldSaveChatWithNullTask() {
        ArgumentCaptor<Chat> chatCaptor = ArgumentCaptor.forClass(Chat.class);

        chatService.saveChat(testProject, null);

        verify(chatRepository).save(chatCaptor.capture());
        Chat savedChat = chatCaptor.getValue();
        assertNotNull(savedChat);
        assertEquals(testProject, savedChat.getProject());
        assertNull(savedChat.getTask());
    }

    @Test
    void saveChat_WhenNullProjectInSingleParam_ShouldSaveChatWithNullProject() {
        ArgumentCaptor<Chat> chatCaptor = ArgumentCaptor.forClass(Chat.class);

        chatService.saveChat(null);

        verify(chatRepository).save(chatCaptor.capture());
        Chat savedChat = chatCaptor.getValue();
        assertNotNull(savedChat);
        assertNull(savedChat.getProject());
        assertNull(savedChat.getTask());
    }

    @Test
    void getChatByTaskId_WhenNullTaskId_ShouldCallRepository() {
        when(chatRepository.findByTaskId(null)).thenReturn(Optional.empty());

        EntityNotFoundException exception = assertThrows(
                EntityNotFoundException.class,
                () -> chatService.getChatByTaskId(null)
        );
        assertEquals("Chat not found", exception.getMessage());
        verify(chatRepository).findByTaskId(null);
    }

    @Test
    void getChatByProjectIdAndTaskId_WhenNullIds_ShouldCallRepository() {
        when(chatRepository.findByProjectIdAndTaskId(null, null)).thenReturn(Optional.empty());

        EntityNotFoundException exception = assertThrows(
                EntityNotFoundException.class,
                () -> chatService.getChatByProjectIdAndTaskId(null, null)
        );
        assertEquals("Chat not found", exception.getMessage());
        verify(chatRepository).findByProjectIdAndTaskId(null, null);
    }
}
