package com.manageit.manageit.dto.project;

import com.manageit.manageit.dto.user.BasicUserDto;
import com.manageit.manageit.project.ProjectStatus;
import com.manageit.manageit.dto.task.TaskDto;
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
    private List<TaskDto> tasks;
    private List<BasicUserDto> members;
}
