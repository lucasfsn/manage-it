package com.manageit.manageit.user;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.manageit.manageit.project.Project;
import com.manageit.manageit.project.ProjectResponse;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserResponse {
    private String firstName;
    private String lastName;
    private String email;
    private String username;
    private LocalDateTime createdAt;
    private List<ProjectResponse> projects;
}
