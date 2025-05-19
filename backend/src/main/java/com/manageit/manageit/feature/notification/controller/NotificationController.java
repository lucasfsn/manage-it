package com.manageit.manageit.feature.notification.controller;

import com.manageit.manageit.feature.notification.dto.NotificationResponseDto;
import com.manageit.manageit.feature.user.model.User;
import com.manageit.manageit.feature.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<List<NotificationResponseDto>> getNotifications(
            @AuthenticationPrincipal User userDetails
    ) {
        return ResponseEntity.ok(notificationService.getNotifications(userDetails));
    }

    @DeleteMapping("/{notificationId}")
    public ResponseEntity<Void> deleteNotification(
            @PathVariable UUID notificationId
    ) {
        notificationService.deleteNotification(notificationId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping()
    public ResponseEntity<Void> deleteNotifications(
            @AuthenticationPrincipal User userDetails
    ) {
        notificationService.deleteNotifications(userDetails);
        return ResponseEntity.noContent().build();
    }
}
