package com.manageit.manageit.feature.notification.mapper;

import com.manageit.manageit.feature.notification.dto.NotificationResponseDto;
import com.manageit.manageit.feature.notification.model.Notification;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface NotificationMapper {
    @Mapping(target = "user", source = "sender")
    @Mapping(target = "id", source = "notificationId")
    @Mapping(target = "date", source = "createdAt")
    NotificationResponseDto toNotificationDto(Notification notification);
}
