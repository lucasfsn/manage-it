package com.manageit.manageit.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthenticationRequestDto {
    @Email(message = "Email should be valid.")
    @NotEmpty(message = "Email is required.")
    @NotBlank(message = "Email is required.")
    private String email;
    @NotEmpty(message = "Password is required.")
    @NotBlank(message = "Password is required.")
    @Size(min = 8, message = "Password should be 8 characters long minimum.")
    private String password;
}
