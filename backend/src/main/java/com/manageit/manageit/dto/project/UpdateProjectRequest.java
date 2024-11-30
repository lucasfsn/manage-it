package com.manageit.manageit.dto.project;


import com.fasterxml.jackson.annotation.JsonInclude;
import com.manageit.manageit.project.ProjectStatus;
import jakarta.validation.constraints.FutureOrPresent;
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
public class UpdateProjectRequest {
    private String name;
    private String description;

    @FutureOrPresent(message = "Start date cannot be in the past.")
    private LocalDate startDate;
    private LocalDate endDate;
    private ProjectStatus status;
}
