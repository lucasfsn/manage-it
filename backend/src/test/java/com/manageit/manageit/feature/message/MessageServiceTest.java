package com.manageit.manageit.feature.message;

import com.manageit.manageit.feature.chat.model.Chat;
import com.manageit.manageit.feature.chat.service.ChatService;
import com.manageit.manageit.feature.message.dto.MessageResponseDto;
import com.manageit.manageit.feature.message.mapper.MessageMapper;
import com.manageit.manageit.feature.message.model.Message;
import com.manageit.manageit.feature.message.repository.MessageRepository;
import com.manageit.manageit.feature.message.service.MessageServiceDefault;
import com.manageit.manageit.feature.user.model.User;
import com.manageit.manageit.feature.user.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MessageServiceTest {

    @Mock
    private MessageRepository messageRepository;

    @Mock
    private ChatService chatService;

    @Mock
    private UserService userService;

    @Mock
    private MessageMapper messageMapper;

    @InjectMocks
    private MessageServiceDefault messageService;

    private User testUser;
    private Chat testChat;
    private Message message1;
    private Message message2;
    private MessageResponseDto messageDto1;
    private MessageResponseDto messageDto2;
    private UUID projectId;
    private UUID taskId;
    private String token;
    private String content;

    @BeforeEach
    void setUp() {
        projectId = UUID.randomUUID();
        taskId = UUID.randomUUID();
        token = "test-token";
        content = "Test message content";

        testUser = User.builder()
                .id(UUID.randomUUID())
                .username("testUser")
                .firstName("Test")
                .lastName("User")
                .email("test@example.com")
                .build();

        message1 = Message.builder()
                .id(UUID.randomUUID())
                .user(testUser)
                .content("Message 1")
                .createdAt(OffsetDateTime.now(ZoneOffset.UTC))
                .build();

        message2 = Message.builder()
                .id(UUID.randomUUID())
                .user(testUser)
                .content("Message 2")
                .createdAt(OffsetDateTime.now(ZoneOffset.UTC))
                .build();

        testChat = Chat.builder()
                .id(UUID.randomUUID())
                .messages(Arrays.asList(message1, message2))
                .build();

        messageDto1 = MessageResponseDto.builder()
                .id(message1.getId())
                .content("Message 1")
                .createdAt(String.valueOf(message1.getCreatedAt()))
                .build();

        messageDto2 = MessageResponseDto.builder()
                .id(message2.getId())
                .content("Message 2")
                .createdAt(String.valueOf(message2.getCreatedAt()))
                .build();
    }

    @Test
    void getMessagesByChat_WhenChatHasMessages_ShouldReturnMessageDtos() {
        when(messageMapper.toMessageDto(message1)).thenReturn(messageDto1);
        when(messageMapper.toMessageDto(message2)).thenReturn(messageDto2);

        List<MessageResponseDto> result = messageService.getMessagesByChat(testChat);

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(messageDto1, result.get(0));
        assertEquals(messageDto2, result.get(1));
        verify(messageMapper, times(2)).toMessageDto(any(Message.class));
    }

    @Test
    void getMessagesByChat_WhenChatHasNoMessages_ShouldReturnEmptyList() {
        Chat emptyChat = Chat.builder()
                .id(UUID.randomUUID())
                .messages(Collections.emptyList())
                .build();

        List<MessageResponseDto> result = messageService.getMessagesByChat(emptyChat);

        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(messageMapper, never()).toMessageDto(any(Message.class));
    }

    @Test
    void saveMessageToProjectChat_WhenValidParameters_ShouldSaveAndReturnMessageDto() {
        MessageResponseDto expectedDto = MessageResponseDto.builder()
                .content(content)
                .build();

        when(chatService.getChatByProjectIdAndTaskId(projectId, null)).thenReturn(testChat);
        when(userService.getUserByToken(token)).thenReturn(testUser);
        when(messageMapper.toMessageDto(any(Message.class))).thenReturn(expectedDto);

        ArgumentCaptor<Message> messageCaptor = ArgumentCaptor.forClass(Message.class);

        MessageResponseDto result = messageService.saveMessageToProjectChat(projectId, token, content);

        assertNotNull(result);
        assertEquals(expectedDto, result);

        verify(chatService).getChatByProjectIdAndTaskId(projectId, null);
        verify(userService).getUserByToken(token);
        verify(messageRepository).save(messageCaptor.capture());
        verify(messageMapper).toMessageDto(any(Message.class));

        Message savedMessage = messageCaptor.getValue();
        assertEquals(testChat, savedMessage.getChat());
        assertEquals(testUser, savedMessage.getUser());
        assertEquals(content, savedMessage.getContent());
        assertNotNull(savedMessage.getCreatedAt());
    }

    @Test
    void saveMessageToTaskChat_WhenValidParameters_ShouldSaveAndReturnMessageDto() {
        MessageResponseDto expectedDto = MessageResponseDto.builder()
                .content(content)
                .build();

        when(chatService.getChatByTaskId(taskId)).thenReturn(testChat);
        when(userService.getUserByToken(token)).thenReturn(testUser);
        when(messageMapper.toMessageDto(any(Message.class))).thenReturn(expectedDto);

        ArgumentCaptor<Message> messageCaptor = ArgumentCaptor.forClass(Message.class);

        MessageResponseDto result = messageService.saveMessageToTaskChat(taskId, token, content);

        assertNotNull(result);
        assertEquals(expectedDto, result);

        verify(chatService).getChatByTaskId(taskId);
        verify(userService).getUserByToken(token);
        verify(messageRepository).save(messageCaptor.capture());
        verify(messageMapper).toMessageDto(any(Message.class));

        Message savedMessage = messageCaptor.getValue();
        assertEquals(testChat, savedMessage.getChat());
        assertEquals(testUser, savedMessage.getUser());
        assertEquals(content, savedMessage.getContent());
        assertNotNull(savedMessage.getCreatedAt());
    }

    @Test
    void saveMessageToProjectChat_WhenNullContent_ShouldSaveMessageWithNullContent() {
        when(chatService.getChatByProjectIdAndTaskId(projectId, null)).thenReturn(testChat);
        when(userService.getUserByToken(token)).thenReturn(testUser);
        when(messageMapper.toMessageDto(any(Message.class))).thenReturn(new MessageResponseDto());

        ArgumentCaptor<Message> messageCaptor = ArgumentCaptor.forClass(Message.class);

        messageService.saveMessageToProjectChat(projectId, token, null);

        verify(messageRepository).save(messageCaptor.capture());
        Message savedMessage = messageCaptor.getValue();
        assertNull(savedMessage.getContent());
        assertEquals(testChat, savedMessage.getChat());
        assertEquals(testUser, savedMessage.getUser());
    }

    @Test
    void saveMessageToTaskChat_WhenNullContent_ShouldSaveMessageWithNullContent() {
        when(chatService.getChatByTaskId(taskId)).thenReturn(testChat);
        when(userService.getUserByToken(token)).thenReturn(testUser);
        when(messageMapper.toMessageDto(any(Message.class))).thenReturn(new MessageResponseDto());

        ArgumentCaptor<Message> messageCaptor = ArgumentCaptor.forClass(Message.class);

        messageService.saveMessageToTaskChat(taskId, token, null);

        verify(messageRepository).save(messageCaptor.capture());
        Message savedMessage = messageCaptor.getValue();
        assertNull(savedMessage.getContent());
        assertEquals(testChat, savedMessage.getChat());
        assertEquals(testUser, savedMessage.getUser());
    }

    @Test
    void saveMessageToProjectChat_ShouldSetCorrectTimestamp() {
        when(chatService.getChatByProjectIdAndTaskId(projectId, null)).thenReturn(testChat);
        when(userService.getUserByToken(token)).thenReturn(testUser);
        when(messageMapper.toMessageDto(any(Message.class))).thenReturn(new MessageResponseDto());

        ArgumentCaptor<Message> messageCaptor = ArgumentCaptor.forClass(Message.class);
        OffsetDateTime beforeCall = OffsetDateTime.now(ZoneOffset.UTC).minusSeconds(1);

        messageService.saveMessageToProjectChat(projectId, token, content);

        OffsetDateTime afterCall = OffsetDateTime.now(ZoneOffset.UTC).plusSeconds(1);

        verify(messageRepository).save(messageCaptor.capture());
        Message savedMessage = messageCaptor.getValue();
        assertTrue(savedMessage.getCreatedAt().isAfter(beforeCall));
        assertTrue(savedMessage.getCreatedAt().isBefore(afterCall));
        assertEquals(ZoneOffset.UTC, savedMessage.getCreatedAt().getOffset());
    }

    @Test
    void saveMessageToTaskChat_ShouldSetCorrectTimestamp() {
        when(chatService.getChatByTaskId(taskId)).thenReturn(testChat);
        when(userService.getUserByToken(token)).thenReturn(testUser);
        when(messageMapper.toMessageDto(any(Message.class))).thenReturn(new MessageResponseDto());

        ArgumentCaptor<Message> messageCaptor = ArgumentCaptor.forClass(Message.class);
        OffsetDateTime beforeCall = OffsetDateTime.now(ZoneOffset.UTC).minusSeconds(1);

        messageService.saveMessageToTaskChat(taskId, token, content);

        OffsetDateTime afterCall = OffsetDateTime.now(ZoneOffset.UTC).plusSeconds(1);

        verify(messageRepository).save(messageCaptor.capture());
        Message savedMessage = messageCaptor.getValue();
        assertTrue(savedMessage.getCreatedAt().isAfter(beforeCall));
        assertTrue(savedMessage.getCreatedAt().isBefore(afterCall));
        assertEquals(ZoneOffset.UTC, savedMessage.getCreatedAt().getOffset());
    }

    @Test
    void getMessagesByChat_WhenChatIsNull_ShouldThrowNullPointerException() {
        assertThrows(NullPointerException.class, () -> messageService.getMessagesByChat(null));
    }
}