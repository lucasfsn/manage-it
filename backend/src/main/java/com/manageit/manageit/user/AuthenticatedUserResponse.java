package com.manageit.manageit.user;

import com.manageit.manageit.project.Project;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AuthenticatedUserResponse {

    private String firstName;
    private String lastName;
//    private String password;
    private String email;
    private String username;

}
