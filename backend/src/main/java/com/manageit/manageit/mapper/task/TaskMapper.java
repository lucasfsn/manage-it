package com.manageit.manageit.mapper.task;

import com.manageit.manageit.dto.task.TaskDto;
import com.manageit.manageit.mapper.user.BasicUserMapper;
import com.manageit.manageit.task.Task;
import com.manageit.manageit.dto.task.TaskMetadataDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskMapper {

    private final BasicUserMapper basicUserMapper;

    public TaskDto toTaskDto(Task task) {
        return TaskDto.builder()
                .id(task.getId())
                .projectId(task.getProjectId())
                .name(task.getName())
                .description(task.getDescription())
                .status(task.getStatus())
                .priority(task.getPriority())
                .dueDate(task.getDueDate())
                .members(task.getUsers().stream().map(basicUserMapper::toBasicUserDto).collect(Collectors.toList()))
                .build();
    }

    public TaskMetadataDto toTaskMetadataDto(Task task) {
        return TaskMetadataDto.builder()
                .id(task.getId())
                .projectId(task.getProjectId())
                .name(task.getName())
                .description(task.getDescription())
                .status(task.getStatus())
                .priority(task.getPriority())
                .dueDate(task.getDueDate())
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .members(task.getUsers().stream().map(basicUserMapper::toBasicUserDto).collect(Collectors.toList()))
                .build();
    }

}
