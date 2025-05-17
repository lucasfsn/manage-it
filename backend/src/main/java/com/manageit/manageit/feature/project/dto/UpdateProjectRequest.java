package com.manageit.manageit.feature.project.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.manageit.manageit.feature.project.model.ProjectStatus;
import com.manageit.manageit.feature.project.validation.EndDateAfterStartDate;
import jakarta.validation.constraints.FutureOrPresent;
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
@EndDateAfterStartDate(message = "End date must be after start date")
public class UpdateProjectRequest {

    @Size(min = 5, max = 100, message = "Project name must be between 5 and 100 characters")
    private String name;

    @Size(min = 5, max = 1000, message = "Description must be between 5 and 1000 characters")
    private String description;

    @FutureOrPresent(message = "Start date cannot be in the past")
    private LocalDate startDate;

    @FutureOrPresent(message = "End date cannot be in the past")
    private LocalDate endDate;

    private ProjectStatus status;
}
