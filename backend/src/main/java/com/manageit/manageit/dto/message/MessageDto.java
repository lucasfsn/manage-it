package com.manageit.manageit.dto.message;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.manageit.manageit.dto.user.BasicUserDto;
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
public class MessageDto {
    private BasicUserDto user;
    private UUID chatId;
    private String message;
    private LocalDateTime createdAt;
}
