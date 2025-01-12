package com.manageit.manageit.feature.project.dto;

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
public class CreateProjectRequest {

    @NotBlank(message = "Project name cannot be empty")
    @Size(max = 255, message = "Project name cannot exceed 255 characters")
    private String name;
    @NotBlank(message = "Description cannot be empty")
    private String description;

    @FutureOrPresent(message = "Start date cannot be in the past.")
    @NotNull(message = "Start date cannot be null")
    private LocalDate startDate;
    @NotNull(message = "End date cannot be null")
    private LocalDate endDate;
}
