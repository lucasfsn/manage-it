package com.manageit.manageit.user;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserResponse {

    private Integer id;
    private String firstName;
    private String lastName;
//    private String password;
    private String email;
    private String username;
}
