package com.manageit.manageit.feature.user.dto;


import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class UserResponseDto {
    @JsonProperty("username")
    String name;
    String firstName;
    String lastName;
}
