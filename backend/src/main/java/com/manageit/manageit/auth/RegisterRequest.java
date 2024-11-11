package com.manageit.manageit.auth;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {

    @NotBlank(message = "Username cannot be empty")
    @Size(min = 8, max = 30, message = "Username must be between 8 and 30 characters")
    private String username;

    @NotBlank(message = "First name cannot be empty")
    @Size(max = 30, min = 2, message = "First name must be between 2 and 30 characters")
    @Pattern(regexp = "^[A-Za-zÀ-ÖØ-öø-ÿ]+$", message = "First name must contain only letters")
    private String firstName;

    @NotBlank(message = "First name cannot be empty")
    @Size(max = 30, min = 2, message = "First name must be between 2 and 30 characters")
    @Pattern(regexp = "^[A-Za-zÀ-ÖØ-öø-ÿ]+$", message = "Last name must contain only letters")
    private String lastName;

    @Email(message = "Email should be valid")
    @NotEmpty(message = "Email is required")
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Password cannot be empty")
    @Size(min = 8, message = "Password must have at least 8 characters")
    private String password;
}
