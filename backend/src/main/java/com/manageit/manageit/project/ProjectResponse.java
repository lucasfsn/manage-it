package com.manageit.manageit.project;

import com.manageit.manageit.user.UserResponse;
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
public class ProjectResponse {
    private UUID id;
    private UserResponse owner;
    private String projectName;
    private String description;
    private ProjectStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDate startDate;
    private LocalDate endDate;
    private List<UserResponse> members;
}
