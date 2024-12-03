package com.manageit.manageit.repository;

import com.manageit.manageit.notification.Notification;
import com.manageit.manageit.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface NotificationRepository extends JpaRepository<Notification, UUID> {
    List<Notification> findByReceiver(User receiver);
    void deleteByReceiver(User receiver);
}
