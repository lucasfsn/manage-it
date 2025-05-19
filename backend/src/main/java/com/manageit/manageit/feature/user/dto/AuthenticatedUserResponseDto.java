package com.manageit.manageit.feature.user.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AuthenticatedUserResponseDto {
    @JsonProperty("username")
    private String name;
    private String firstName;
    private String lastName;
    private String email;
}
