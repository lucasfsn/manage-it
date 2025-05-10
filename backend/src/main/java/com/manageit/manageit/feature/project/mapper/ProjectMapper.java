package com.manageit.manageit.feature.project.mapper;

import com.manageit.manageit.feature.project.dto.ProjectResponseDto;
import com.manageit.manageit.feature.project.dto.UserProfileProjectDto;
import com.manageit.manageit.feature.project.model.Project;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ProjectMapper {

    @Mapping(target = "owner", source = "owner")
    @Mapping(target = "totalTasks", expression = "java(project.getTasks().size())")
    @Mapping(target = "completedTasks", expression = "java((int) project.getTasks().stream().filter(task -> task.getStatus() == com.manageit.manageit.feature.task.model.TaskStatus.COMPLETED).count())")
    @Mapping(target = "members", source = "members")
    ProjectResponseDto toProjectResponseDto(Project project);

    UserProfileProjectDto toUserProfileProjectDto(Project project);
}
