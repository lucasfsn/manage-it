package com.manageit.manageit.feature.task.mapper;

import com.manageit.manageit.feature.task.dto.TaskDetailsResponseDto;
import com.manageit.manageit.feature.task.dto.TaskResponseDto;
import com.manageit.manageit.feature.task.model.Task;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValueMappingStrategy;

@Mapper(componentModel = "spring", nullValueMappingStrategy = NullValueMappingStrategy.RETURN_DEFAULT)
public interface TaskMapper {
    @Mapping(target = "projectId", expression = "java(task.getProject().getId())")
    @Mapping(target = "members", source = "users")
    @Mapping(target = "projectStatus", expression = "java(task.getProject().getStatus())")
    @Mapping(target = "projectEndDate", expression = "java(task.getProject().getEndDate())")
    TaskResponseDto toTaskResponseDto(Task task);

    @Mapping(target = "projectId", expression = "java(task.getProject().getId())")
    @Mapping(target = "members", source = "users")
    @Mapping(target = "projectStatus", expression = "java(task.getProject().getStatus())")
    @Mapping(target = "projectEndDate", expression = "java(task.getProject().getEndDate())")
    TaskDetailsResponseDto toTaskDetailsResponseDto(Task task);
}
