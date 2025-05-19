package com.manageit.manageit.feature.task.dto;

import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class TaskDetailsResponseDto extends TaskResponseDto {
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
