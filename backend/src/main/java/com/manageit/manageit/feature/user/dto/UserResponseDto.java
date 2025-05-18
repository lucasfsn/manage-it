package com.manageit.manageit.feature.user.dto;


import lombok.*;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class UserResponseDto {
    String username;
    String firstName;
    String lastName;
}
