package com.manageit.manageit.feature.message.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.manageit.manageit.feature.user.dto.UserResponseDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.UUID;

@Data
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class MessageResponseDto {
    private UUID id;
    private String createdAt;
    private UserResponseDto sender;
    private String content;
}
