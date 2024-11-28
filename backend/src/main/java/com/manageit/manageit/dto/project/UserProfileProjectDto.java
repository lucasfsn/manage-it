package com.manageit.manageit.dto.project;

import com.manageit.manageit.dto.user.BasicUserDto;
import com.manageit.manageit.project.ProjectStatus;
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
    private List<BasicUserDto> members;
}
