package com.manageit.manageit.service;

import com.manageit.manageit.dto.notification.NotificationDto;
import com.manageit.manageit.mapper.notification.NotificationMapper;
import com.manageit.manageit.repository.NotificationRepository;
import com.manageit.manageit.repository.UserRepository;
import com.manageit.manageit.security.JwtService;
import com.manageit.manageit.user.User;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
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

        return notificationRepository.findByUser(user)
                .stream().map(notificationMapper::toNotificationDto)
                .toList();
    }
}
