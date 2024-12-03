package com.manageit.manageit.controller;

import com.manageit.manageit.dto.notification.NotificationDto;
import com.manageit.manageit.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<List<NotificationDto>> getNotifications(
            @RequestHeader("Authorization") String token
    ) {
        return ResponseEntity.ok(notificationService.getNotifications(token));
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
            @RequestHeader("Authorization") String token
    ) {
        notificationService.deleteNotifications(token);
        return ResponseEntity.noContent().build();
    }
}
