package com.manageit.manageit.feature.notification.mapper;

import com.manageit.manageit.feature.notification.dto.NotificationDto;
import com.manageit.manageit.feature.user.mapper.BasicUserMapper;
import com.manageit.manageit.feature.notification.model.Notification;
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
