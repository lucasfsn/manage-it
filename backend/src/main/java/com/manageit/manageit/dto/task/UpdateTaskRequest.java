package com.manageit.manageit.dto.task;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.manageit.manageit.model.task.TaskPriority;
import com.manageit.manageit.model.task.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UpdateTaskRequest {
    private String description;
    private TaskStatus status;
    private TaskPriority priority;
    private LocalDate dueDate;
}
