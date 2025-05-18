package com.manageit.manageit.auth.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;



@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequestDto {

    @NotBlank(message = "Username cannot be empty")
    @Size(min = 7, max = 30, message = "Username must be between 7 and 30 characters")
    @Pattern(
            regexp = "^[A-Za-z][A-Za-z0-9_]{7,29}$",
            message = "Username must contain at least two letters, cannot include certain special characters, and must not start or end with spaces."
    )
    private String username;

    @NotBlank(message = "First name cannot be empty")
    @Size(max = 50, min = 2, message = "First name must be between 2 and 50 characters")
    @Pattern(
            regexp = "^[a-zA-Z\\xC0-\\uFFFF]+([ \\-']{0,1}[a-zA-Z\\xC0-\\uFFFF]+){0,2}[.]{0,1}$",
            message = "First name must contain only letters")
    private String firstName;

    @NotBlank(message = "First name cannot be empty")
    @Size(max = 50, min = 2, message = "First name must be between 2 and 50 characters")
    @Pattern(
            regexp = "^[a-zA-Z\\xC0-\\uFFFF]+([ \\-']{0,1}[a-zA-Z\\xC0-\\uFFFF]+){0,2}[.]{0,1}$",
            message = "Last name must contain only letters")
    private String lastName;

    @Email(message = "Email should be valid")
    @NotEmpty(message = "Email is required")
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Password cannot be empty")
    @Size(min = 8, message = "Password must have at least 8 characters")
    @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$",
            message = "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character (!@#$%^&*)."
    )
    private String password;
}
