package com.manageit.manageit.feature.project.dto;

import com.manageit.manageit.feature.user.dto.UserResponseDto;
import com.manageit.manageit.feature.project.model.ProjectStatus;
import lombok.*;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserProfileProjectDto {
    private UUID id;
    private String name;
    private String description;
    private ProjectStatus status;
    private List<UserResponseDto> members;
}
