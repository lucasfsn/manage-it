package com.manageit.manageit.feature.notification.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.manageit.manageit.feature.user.dto.UserResponseDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class NotificationResponseDto {
    private UUID id;
    private UserResponseDto user;
    private String message;
    private LocalDateTime date;
    private UUID projectId;
    private UUID taskId;
}
