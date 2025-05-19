package com.manageit.manageit.feature.project.dto;

import com.manageit.manageit.feature.user.dto.UserResponseDto;
import com.manageit.manageit.feature.project.model.ProjectStatus;
import com.manageit.manageit.feature.task.dto.TaskDetailsResponseDto;
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
public class ProjectResponseDto {
    private UUID id;
    private UserResponseDto owner;
    private String name;
    private String description;
    private ProjectStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer completedTasks;
    private Integer totalTasks;
    private List<TaskDetailsResponseDto> tasks;
    private List<UserResponseDto> members;
}
