package com.manageit.manageit.dto.task;

import com.manageit.manageit.dto.user.BasicUserDto;
import com.manageit.manageit.task.TaskPriority;
import com.manageit.manageit.task.TaskStatus;
import lombok.*;

import java.util.UUID;
import java.util.List;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TaskDto {
    private UUID id;
    private UUID projectId;
    private String name;
    private String description;
    private TaskStatus status;
    private TaskPriority priority;
    private LocalDate dueDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<BasicUserDto> members;
}
