package com.manageit.manageit.dto.user;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.manageit.manageit.dto.project.UserProfileProjectDto;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserResponseDto extends BasicUserDto {
    private String email;
    private LocalDateTime createdAt;
    private List<UserProfileProjectDto> projects;
}
