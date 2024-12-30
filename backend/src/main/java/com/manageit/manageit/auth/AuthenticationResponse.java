package com.manageit.manageit.auth;

import com.manageit.manageit.dto.user.AuthenticatedUserResponseDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthenticationResponse {
    private String token;
    private AuthenticatedUserResponseDto user;
}
