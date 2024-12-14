package com.manageit.manageit.mapper.notification;

import com.manageit.manageit.dto.notification.NotificationDto;
import com.manageit.manageit.mapper.user.BasicUserMapper;
import com.manageit.manageit.model.notification.Notification;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationMapper {

    private final BasicUserMapper basicUserMapper;

    public NotificationDto toNotificationDto(Notification notification) {
        return NotificationDto.builder()
                .id(notification.getNotificationId())
                .user(basicUserMapper.toBasicUserDto(notification.getSender()))
                .message(notification.getMessage())
                .date(notification.getCreatedAt())
                .projectId(notification.getProjectId())
                .taskId(notification.getTaskId() != null ? notification.getTaskId() : null)
                .build();
    }
}
