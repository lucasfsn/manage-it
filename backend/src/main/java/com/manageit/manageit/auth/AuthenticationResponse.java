package com.manageit.manageit.auth;

import com.manageit.manageit.feature.user.dto.AuthenticatedUserResponseDto;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthenticationResponse {
    private String accessToken;
    private String refreshToken;
    private AuthenticatedUserResponseDto user;
}
