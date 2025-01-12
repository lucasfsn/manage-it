package com.manageit.manageit.feature.notification.repository;

import com.manageit.manageit.feature.notification.model.Notification;
import com.manageit.manageit.feature.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface NotificationRepository extends JpaRepository<Notification, UUID> {
    List<Notification> findByReceiver(User receiver);
    void deleteByReceiver(User receiver);
}
