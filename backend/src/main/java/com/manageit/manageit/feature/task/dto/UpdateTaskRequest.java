package com.manageit.manageit.feature.task.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.manageit.manageit.feature.task.model.TaskPriority;
import com.manageit.manageit.feature.task.model.TaskStatus;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
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
    @Size(min = 5, max = 500, message = "Task description must be between 5 and 500 characters.")
    private String description;

    private TaskStatus status;

    private TaskPriority priority;

    @FutureOrPresent(message = "Task due date cannot be in the past.")
    private LocalDate dueDate;
}
