package com.manageit.manageit.feature.notification.service;

import com.manageit.manageit.feature.notification.dto.NotificationResponseDto;
import com.manageit.manageit.feature.user.model.User;

import java.util.List;
import java.util.UUID;

public interface NotificationService {
    List<NotificationResponseDto> getNotifications(User user);

    void createAndSendNotification(List<User> recipients, User sender, String message, UUID projectId, UUID taskId);

    void deleteNotification(UUID notificationId);

    void deleteNotifications(User user);
}
