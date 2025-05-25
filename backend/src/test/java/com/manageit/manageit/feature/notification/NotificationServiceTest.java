package com.manageit.manageit.feature.notification;

import com.manageit.manageit.feature.notification.dto.NotificationResponseDto;
import com.manageit.manageit.feature.notification.mapper.NotificationMapper;
import com.manageit.manageit.feature.notification.model.Notification;
import com.manageit.manageit.feature.notification.repository.NotificationRepository;
import com.manageit.manageit.feature.notification.service.NotificationServiceDefault;
import com.manageit.manageit.feature.user.model.User;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NotificationServiceTest {

    @Mock
    private NotificationRepository notificationRepository;

    @Mock
    private NotificationMapper notificationMapper;

    @InjectMocks
    private NotificationServiceDefault notificationService;

    private User sender;
    private User recipient1;
    private User recipient2;
    private Notification notification1;
    private Notification notification2;
    private NotificationResponseDto notificationDto1;
    private NotificationResponseDto notificationDto2;
    private UUID projectId;
    private UUID taskId;
    private UUID notificationId;

    @BeforeEach
    void setUp() {
        sender = User.builder()
                .id(UUID.randomUUID())
                .username("sender")
                .email("sender@test.com")
                .firstName("John")
                .lastName("Sender")
                .build();

        recipient1 = User.builder()
                .id(UUID.randomUUID())
                .username("recipient1")
                .email("recipient1@test.com")
                .firstName("Jane")
                .lastName("Recipient")
                .build();

        recipient2 = User.builder()
                .id(UUID.randomUUID())
                .username("recipient2")
                .email("recipient2@test.com")
                .firstName("Bob")
                .lastName("Recipient")
                .build();

        projectId = UUID.randomUUID();
        taskId = UUID.randomUUID();
        notificationId = UUID.randomUUID();

        notification1 = Notification.builder()
                .notificationId(UUID.randomUUID())
                .receiver(recipient1)
                .sender(sender)
                .message("Test notification 1")
                .projectId(projectId)
                .taskId(taskId)
                .createdAt(LocalDateTime.now())
                .build();

        notification2 = Notification.builder()
                .notificationId(UUID.randomUUID())
                .receiver(recipient1)
                .sender(sender)
                .message("Test notification 2")
                .projectId(projectId)
                .taskId(taskId)
                .createdAt(LocalDateTime.now())
                .build();

        notificationDto1 = NotificationResponseDto.builder()
                .id(notification1.getNotificationId())
                .message("Test notification 1")
                .date(notification1.getCreatedAt())
                .projectId(projectId)
                .taskId(taskId)
                .build();

        notificationDto2 = NotificationResponseDto.builder()
                .id(notification2.getNotificationId())
                .message("Test notification 2")
                .date(notification2.getCreatedAt())
                .projectId(projectId)
                .taskId(taskId)
                .build();
    }

    @Test
    void getNotifications_WhenUserHasNotifications_ShouldReturnNotificationDtos() {
        List<Notification> notifications = Arrays.asList(notification1, notification2);
        when(notificationRepository.findByReceiver(recipient1)).thenReturn(notifications);
        when(notificationMapper.toNotificationDto(notification1)).thenReturn(notificationDto1);
        when(notificationMapper.toNotificationDto(notification2)).thenReturn(notificationDto2);

        List<NotificationResponseDto> result = notificationService.getNotifications(recipient1);

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(notificationDto1, result.get(0));
        assertEquals(notificationDto2, result.get(1));
        verify(notificationRepository).findByReceiver(recipient1);
        verify(notificationMapper, times(2)).toNotificationDto(any(Notification.class));
    }

    @Test
    void getNotifications_WhenUserHasNoNotifications_ShouldReturnEmptyList() {
        when(notificationRepository.findByReceiver(recipient1)).thenReturn(Collections.emptyList());

        List<NotificationResponseDto> result = notificationService.getNotifications(recipient1);

        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(notificationRepository).findByReceiver(recipient1);
        verify(notificationMapper, never()).toNotificationDto(any(Notification.class));
    }

    @Test
    void createAndSendNotification_WhenValidRecipients_ShouldCreateNotificationsExceptForSender() {
        List<User> recipients = Arrays.asList(sender, recipient1, recipient2);
        String message = "Test notification message";
        ArgumentCaptor<Notification> notificationCaptor = ArgumentCaptor.forClass(Notification.class);

        notificationService.createAndSendNotification(recipients, sender, message, projectId, taskId);

        verify(notificationRepository, times(2)).save(notificationCaptor.capture());

        List<Notification> savedNotifications = notificationCaptor.getAllValues();
        assertEquals(2, savedNotifications.size());

        Notification firstNotification = savedNotifications.getFirst();
        assertEquals(recipient1, firstNotification.getReceiver());
        assertEquals(sender, firstNotification.getSender());
        assertEquals(message, firstNotification.getMessage());
        assertEquals(projectId, firstNotification.getProjectId());
        assertEquals(taskId, firstNotification.getTaskId());
        assertNotNull(firstNotification.getCreatedAt());

        Notification secondNotification = savedNotifications.get(1);
        assertEquals(recipient2, secondNotification.getReceiver());
        assertEquals(sender, secondNotification.getSender());
        assertEquals(message, secondNotification.getMessage());
        assertEquals(projectId, secondNotification.getProjectId());
        assertEquals(taskId, secondNotification.getTaskId());
        assertNotNull(secondNotification.getCreatedAt());
    }

    @Test
    void createAndSendNotification_WhenSenderIsOnlyRecipient_ShouldNotCreateNotification() {
        List<User> recipients = Collections.singletonList(sender);
        String message = "Test notification message";

        notificationService.createAndSendNotification(recipients, sender, message, projectId, taskId);

        verify(notificationRepository, never()).save(any(Notification.class));
    }

    @Test
    void createAndSendNotification_WhenRecipientsListEmpty_ShouldNotCreateNotifications() {
        List<User> recipients = Collections.emptyList();
        String message = "Test notification message";

        notificationService.createAndSendNotification(recipients, sender, message, projectId, taskId);

        verify(notificationRepository, never()).save(any(Notification.class));
    }

    @Test
    void createAndSendNotification_WhenNullParameters_ShouldCreateNotificationsWithNulls() {
        List<User> recipients = Collections.singletonList(recipient1);

        notificationService.createAndSendNotification(recipients, sender, null, null, null);

        ArgumentCaptor<Notification> notificationCaptor = ArgumentCaptor.forClass(Notification.class);
        verify(notificationRepository).save(notificationCaptor.capture());

        Notification savedNotification = notificationCaptor.getValue();
        assertNull(savedNotification.getMessage());
        assertNull(savedNotification.getProjectId());
        assertNull(savedNotification.getTaskId());
        assertEquals(recipient1, savedNotification.getReceiver());
        assertEquals(sender, savedNotification.getSender());
        assertNotNull(savedNotification.getCreatedAt());
    }

    @Test
    void deleteNotification_WhenNotificationExists_ShouldDeleteNotification() {
        when(notificationRepository.existsById(notificationId)).thenReturn(true);

        notificationService.deleteNotification(notificationId);

        verify(notificationRepository).existsById(notificationId);
        verify(notificationRepository).deleteById(notificationId);
    }

    @Test
    void deleteNotification_WhenNotificationNotExists_ShouldThrowEntityNotFoundException() {
        when(notificationRepository.existsById(notificationId)).thenReturn(false);

        EntityNotFoundException exception = assertThrows(
                EntityNotFoundException.class,
                () -> notificationService.deleteNotification(notificationId)
        );
        assertEquals("Notification not found with id " + notificationId, exception.getMessage());
        verify(notificationRepository).existsById(notificationId);
        verify(notificationRepository, never()).deleteById(notificationId);
    }

    @Test
    void deleteNotifications_WhenValidUser_ShouldDeleteAllNotificationsForUser() {
        notificationService.deleteNotifications(recipient1);

        verify(notificationRepository).deleteByReceiver(recipient1);
    }
}