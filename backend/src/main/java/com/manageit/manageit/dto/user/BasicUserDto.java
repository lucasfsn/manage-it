package com.manageit.manageit.dto.user;


import lombok.*;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class BasicUserDto {
    String username;
    String firstName;
    String lastName;
}
