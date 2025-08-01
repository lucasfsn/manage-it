package com.manageit.manageit.feature.user.dto;


import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UpdateUserRequestDto {

    @Size(max = 50, min = 2, message = "First name must be between 2 and 50 characters")
    @Pattern(
            regexp = "^(?=(?:[^A-Za-z]*[A-Za-z]){2})(?![^\\d~`?!^*¨ˆ;@=$%{}\\[\\]|\\\\/<>#“.,]*[\\d~`?!^*¨ˆ;@=$%{}\\[\\]|\\\\/<>#“.,])\\S+(?: \\S+){0,2}$",
            message = "First name must contain only letters")
    private String firstName;

    @Size(max = 50, min = 2, message = "First name must be between 2 and 50 characters")
    @Pattern(
            regexp = "^(?=(?:[^A-Za-z]*[A-Za-z]){2})(?![^\\d~`?!^*¨ˆ;@=$%{}\\[\\]|\\\\/<>#“.,]*[\\d~`?!^*¨ˆ;@=$%{}\\[\\]|\\\\/<>#“.,])\\S+(?: \\S+){0,2}$",
            message = "Last name must contain only letters")
    private String lastName;

    @Email(message = "Email should be valid")
    private String email;

    @Size(min = 8, message = "Password must have at least 8 characters")
    @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$",
            message = "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character (!@#$%^&*)."
    )
    private String password;
}