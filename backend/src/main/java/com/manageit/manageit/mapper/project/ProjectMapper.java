package com.manageit.manageit.mapper.project;

import com.manageit.manageit.dto.project.UserProfileProjectDto;
import com.manageit.manageit.mapper.user.BasicUserMapper;
import com.manageit.manageit.project.Project;
import com.manageit.manageit.dto.project.ProjectDto;
import com.manageit.manageit.mapper.task.TaskMapper;
import com.manageit.manageit.task.TaskStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectMapper {

    private final BasicUserMapper basicUserMapper;
    private final TaskMapper taskMapper;

    public ProjectDto toProjectDto(Project project) {
        return ProjectDto.builder()
                .id(project.getId())
                .owner(basicUserMapper.toBasicUserDto(project.getOwner()))
                .name(project.getName())
                .description(project.getDescription())
                .status(project.getStatus())
                .createdAt(project.getCreatedAt())
                .updatedAt(project.getUpdatedAt())
                .startDate(project.getStartDate())
                .endDate(project.getEndDate())
                .totalTasks(project.getTasks().size())
                .completedTasks(Math.toIntExact(project.getTasks()
                        .stream()
                        .filter(task -> task.getStatus() == TaskStatus.COMPLETED)
                        .count()))
                .tasks(project.getTasks().stream().map(taskMapper::toTaskMetadataDto).collect(Collectors.toList()))
                .members(project.getMembers().stream().map(basicUserMapper::toBasicUserDto).collect(Collectors.toList()))
                .build();
    }

    public UserProfileProjectDto toUserProfileProjectDto(Project project) {
        return UserProfileProjectDto.builder()
                .id(project.getId())
                .name(project.getName())
                .description(project.getDescription())
                .status(project.getStatus())
                .members(project.getMembers().stream().map(basicUserMapper::toBasicUserDto).collect(Collectors.toList()))
                .build();
    }

}
