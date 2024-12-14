package com.manageit.manageit.dto.message;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.manageit.manageit.dto.user.BasicUserDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class MessageDto {
    private UUID id;
    private String createdAt;
    private BasicUserDto user;
    private String content;
}
