package com.manageit.manageit.feature.notification.controller;

import com.manageit.manageit.feature.notification.dto.NotificationResponseDto;
import com.manageit.manageit.feature.user.model.User;
import com.manageit.manageit.feature.notification.service.NotificationService;
import com.manageit.manageit.shared.dto.ResponseDto;
import com.manageit.manageit.shared.enums.SuccessCode;
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
    public ResponseDto<List<NotificationResponseDto>> getNotifications(
            @AuthenticationPrincipal User userDetails
    ) {
        return new ResponseDto<>(
                SuccessCode.RESPONSE_SUCCESSFUL,
                "Notifications found successfully",
                notificationService.getNotifications(userDetails)
        );
    }

    @DeleteMapping("/{notificationId}")
    public ResponseEntity<ResponseDto<Void>> deleteNotification(
            @PathVariable UUID notificationId
    ) {
        notificationService.deleteNotification(notificationId);
        return ResponseEntity.ok(
                new ResponseDto<>(
                        SuccessCode.RESOURCE_DELETED,
                        "Notification deleted successfully with id: " + notificationId,
                        null
                )
        );
    }

    @DeleteMapping()
    public ResponseEntity<ResponseDto<Void>> deleteNotifications(
            @AuthenticationPrincipal User userDetails
    ) {
        notificationService.deleteNotifications(userDetails);
        return ResponseEntity.ok(
                new ResponseDto<>(
                        SuccessCode.RESOURCE_DELETED,
                        "All notifications deleted successfully",
                        null
                )
        );
    }
}
