package com.manageit.manageit.feature.task.dto;

import com.manageit.manageit.feature.user.dto.UserResponseDto;
import com.manageit.manageit.feature.task.model.TaskPriority;
import com.manageit.manageit.feature.task.model.TaskStatus;
import com.manageit.manageit.feature.project.model.ProjectStatus;
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
public class TaskResponseDto {
    private UUID id;
    private UUID projectId;
    private String description;
    private TaskStatus status;
    private TaskPriority priority;
    private LocalDate dueDate;
    private List<UserResponseDto> members;
    private ProjectStatus projectStatus;
    private LocalDate projectEndDate;
}
