package com.manageit.manageit.auth.service;

import com.manageit.manageit.auth.dto.AuthenticationRequestDto;
import com.manageit.manageit.auth.dto.AuthenticationResponseDto;
import com.manageit.manageit.auth.dto.RegisterRequestDto;
import com.manageit.manageit.jwt.dto.JwtTokenResponseDto;

public interface AuthenticationService {

    AuthenticationResponseDto register(RegisterRequestDto request);

    AuthenticationResponseDto authenticate(AuthenticationRequestDto request);

    JwtTokenResponseDto refreshToken(String refreshToken);
}
