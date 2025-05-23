package com.manageit.manageit.feature.user.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AuthenticatedUserResponseDto {
    private UUID id;
    @JsonProperty("username")
    private String name;
    private String firstName;
    private String lastName;
    private String email;
}
