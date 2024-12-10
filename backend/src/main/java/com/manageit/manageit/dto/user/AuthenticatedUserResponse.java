package com.manageit.manageit.dto.user;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AuthenticatedUserResponse {
    private String firstName;
    private String lastName;
    private String email;
    private String username;

}
