package com.manageit.manageit.service;

import com.manageit.manageit.dto.notification.NotificationDto;
import com.manageit.manageit.mapper.notification.NotificationMapper;
import com.manageit.manageit.model.notification.Notification;
import com.manageit.manageit.repository.NotificationRepository;
import com.manageit.manageit.model.user.User;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final NotificationMapper notificationMapper;
    private final UserService userService;

    public List<NotificationDto> getNotifications(String token) {
        User user = userService.getUserByToken(token);

        return notificationRepository.findByReceiver(user)
                .stream().map(notificationMapper::toNotificationDto)
                .toList();
    }

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

    public void deleteNotification(UUID notificationId) {
        notificationRepository.deleteById(notificationId);
    }

    @Transactional
    public void deleteNotifications(String token) {
        User user = userService.getUserByToken(token);
        notificationRepository.deleteByReceiver(user);
    }
}
