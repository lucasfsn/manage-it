package com.manageit.manageit.service;

import com.manageit.manageit.dto.notification.NotificationDto;
import com.manageit.manageit.mapper.notification.NotificationMapper;
import com.manageit.manageit.notification.Notification;
import com.manageit.manageit.project.Project;
import com.manageit.manageit.repository.NotificationRepository;
import com.manageit.manageit.repository.UserRepository;
import com.manageit.manageit.security.JwtService;
import com.manageit.manageit.task.Task;
import com.manageit.manageit.user.User;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.aspectj.weaver.ast.Not;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final NotificationMapper notificationMapper;

    public List<NotificationDto> getNotifications(String token) {
        String username = jwtService.extractUsername(token.replace("Bearer ", ""));
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("No user found with username: " + username));

        return notificationRepository.findByReceiver(user)
                .stream().map(notificationMapper::toNotificationDto)
                .toList();
    }

    public void createAndSendNotification(List<User> users, User sender, String message, Project project, Task task) {
        users.stream()
                .filter(user -> !user.equals(sender))
                .toList()
                .forEach(user -> {
            Notification notification = Notification.builder()
                    .receiver(user)
                    .sender(sender)
                    .task(task)
                    .assignedProject(project)
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
        String username = jwtService.extractUsername(token.replace("Bearer ", ""));
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("No user found with username: " + username));
        notificationRepository.deleteByReceiver(user);
    }
}
