package com.manageit.manageit.dto.task;

import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class TaskMetadataDto extends TaskDto{
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
