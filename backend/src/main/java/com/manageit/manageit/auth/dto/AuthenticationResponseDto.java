package com.manageit.manageit.auth.dto;

import com.manageit.manageit.feature.user.dto.AuthenticatedUserResponseDto;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthenticationResponseDto {
    private String accessToken;
    private String refreshToken;
    private AuthenticatedUserResponseDto user;
}
