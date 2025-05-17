
package com.manageit.manageit.feature.project.dto;

import com.manageit.manageit.feature.project.validation.EndDateAfterStartDate;
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
@EndDateAfterStartDate(message = "End date must be after start date")
public class CreateProjectRequest {

    @NotBlank(message = "Project name cannot be empty.")
    @Size(min = 5, max = 100, message = "Project name must be between 5 and 100 characters.")
    private String name;

    @NotBlank(message = "Description cannot be empty.")
    @Size(min = 5, max = 1000, message = "Description must be between 5 and 1000 characters.")
    private String description;

    @FutureOrPresent(message = "Start date cannot be in the past.")
    @NotNull(message = "Start date cannot be null.")
    private LocalDate startDate;

    @FutureOrPresent(message = "End date cannot be in the past.")
    @NotNull(message = "End date cannot be null.")
    private LocalDate endDate;
}
