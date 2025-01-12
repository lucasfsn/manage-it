package com.manageit.manageit.feature.user.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AuthenticatedUserResponseDto {
    private String firstName;
    private String lastName;
    private String email;
    private String username;

}
