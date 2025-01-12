package com.manageit.manageit.feature.project.dto;

import com.manageit.manageit.feature.user.dto.BasicUserDto;
import com.manageit.manageit.feature.project.model.ProjectStatus;
import com.manageit.manageit.feature.task.dto.TaskMetadataDto;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProjectDto {
    private UUID id;
    private BasicUserDto owner;
    private String name;
    private String description;
    private ProjectStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer completedTasks;
    private Integer totalTasks;
    private List<TaskMetadataDto> tasks;
    private List<BasicUserDto> members;
}
