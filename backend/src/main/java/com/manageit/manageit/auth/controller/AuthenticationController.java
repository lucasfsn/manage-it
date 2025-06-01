package com.manageit.manageit.auth.controller;

import com.manageit.manageit.auth.dto.AuthenticationRequestDto;
import com.manageit.manageit.auth.dto.AuthenticationResponseDto;
import com.manageit.manageit.auth.dto.RegisterRequestDto;
import com.manageit.manageit.auth.service.AuthenticationService;
import com.manageit.manageit.configuration.jwt.dto.JwtTokenResponseDto;
import com.manageit.manageit.feature.user.dto.AuthenticatedUserResponseDto;
import com.manageit.manageit.feature.user.service.UserService;
import com.manageit.manageit.shared.dto.ResponseDto;
import com.manageit.manageit.shared.enums.SuccessCode;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final UserService userService;
    private final AuthenticationService authService;

    @PostMapping("/register")
    public ResponseEntity<ResponseDto<AuthenticationResponseDto>> register(
            @RequestBody @Valid RegisterRequestDto request
    ) {
        AuthenticationResponseDto authenticationResponseDto = authService.register(request);
        URI location = ServletUriComponentsBuilder
                .fromCurrentContextPath()
                .path("/user/{id}")
                .buildAndExpand(authenticationResponseDto.getUser().getId())
                .toUri();

        ResponseDto<AuthenticationResponseDto> response = new ResponseDto<>(
                SuccessCode.RESOURCE_CREATED,
                "User registered successfully",
                authenticationResponseDto
        );
        return ResponseEntity.created(location).body(response);
    }

    @PostMapping("/authenticate")
    public ResponseDto<AuthenticationResponseDto> authenticate(
            @RequestBody @Valid AuthenticationRequestDto request
    ) {
        return new ResponseDto<>(
                SuccessCode.RESPONSE_SUCCESSFUL,
                "User authenticated successfully",
                authService.authenticate(request)
        );
    }

    @GetMapping("/user")
    public ResponseDto<AuthenticatedUserResponseDto> getCurrentUser(
            @RequestHeader("Authorization") String token
    ) {
        return new ResponseDto<>(
                SuccessCode.RESPONSE_SUCCESSFUL,
                "User fetched successfully",
                userService.findByToken(token)
        ); // to improve, change this method to return the user directly
    }

    @PostMapping("/refresh-token")
    public ResponseDto<JwtTokenResponseDto> refreshToken(
            @RequestHeader("Authorization") String token
    ) {
        return new ResponseDto<>(
                SuccessCode.RESPONSE_SUCCESSFUL,
                "Token refreshed successfully",
                authService.refreshToken(token)
        );
    }
}
