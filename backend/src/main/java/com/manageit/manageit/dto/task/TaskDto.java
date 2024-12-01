package com.manageit.manageit.dto.task;

import com.manageit.manageit.dto.user.BasicUserDto;
import com.manageit.manageit.task.TaskPriority;
import com.manageit.manageit.task.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class TaskDto {
    private UUID id;
    private UUID projectId;
    private String name;
    private String description;
    private TaskStatus status;
    private TaskPriority priority;
    private LocalDate dueDate;
    private List<BasicUserDto> members;
}
