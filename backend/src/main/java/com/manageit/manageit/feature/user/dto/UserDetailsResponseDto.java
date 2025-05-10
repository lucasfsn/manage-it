package com.manageit.manageit.feature.user.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.manageit.manageit.feature.project.dto.UserProfileProjectDto;
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
public class UserDetailsResponseDto extends UserResponseDto {
    private String email;
    private List<UserProfileProjectDto> projects;
    private LocalDateTime createdAt;
}
