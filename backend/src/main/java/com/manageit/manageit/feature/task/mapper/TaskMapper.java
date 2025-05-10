package com.manageit.manageit.feature.task.mapper;

import com.manageit.manageit.feature.task.dto.TaskDetailsResponseDto;
import com.manageit.manageit.feature.task.dto.TaskResponseDto;
import com.manageit.manageit.feature.task.model.Task;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TaskMapper {

    @Mapping(target = "projectId", expression = "java(task.getProject().getId())")
    @Mapping(target = "members", source = "users")
    TaskResponseDto toTaskResponseDto(Task task);

    TaskDetailsResponseDto toTaskDetailsResponseDto(Task task);
}
