package com.manageit.manageit.feature.notification.service;

import com.manageit.manageit.feature.notification.dto.NotificationResponseDto;
import com.manageit.manageit.feature.notification.mapper.NotificationMapper;
import com.manageit.manageit.feature.notification.model.Notification;
import com.manageit.manageit.feature.notification.repository.NotificationRepository;
import com.manageit.manageit.feature.user.model.User;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NotificationServiceDefault implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final NotificationMapper notificationMapper;

    @Override
    public List<NotificationResponseDto> getNotifications(User user) {
        return notificationRepository.findByReceiver(user)
                .stream().map(notificationMapper::toNotificationDto)
                .toList();
    }

    @Override
    public void createAndSendNotification(List<User> recipients, User sender, String message, UUID projectId, UUID taskId) {
        recipients.stream()
                .filter(user -> !user.equals(sender))
                .toList()
                .forEach(user -> {
                    Notification notification = Notification.builder()
                            .receiver(user)
                            .sender(sender)
                            .taskId(taskId)
                            .projectId(projectId)
                            .message(message)
                            .createdAt(LocalDateTime.now())
                            .build();

                    notificationRepository.save(notification);
                });

    }

    @Override
    public void deleteNotification(UUID notificationId) {
        notificationRepository.deleteById(notificationId);
    }

    @Override
    @Transactional
    public void deleteNotifications(User user) {
        notificationRepository.deleteByReceiver(user);
    }
}