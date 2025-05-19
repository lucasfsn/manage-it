package com.manageit.manageit.auth.controller;

import com.manageit.manageit.auth.service.AuthenticationService;
import com.manageit.manageit.auth.dto.RegisterRequestDto;
import com.manageit.manageit.auth.dto.AuthenticationRequestDto;
import com.manageit.manageit.auth.dto.AuthenticationResponseDto;
import com.manageit.manageit.feature.user.dto.AuthenticatedUserResponseDto;
import com.manageit.manageit.feature.user.service.UserService;
import com.manageit.manageit.jwt.dto.JwtTokenResponseDto;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final UserService userService;
    private final AuthenticationService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponseDto> register (
            @RequestBody @Valid RegisterRequestDto request
    ) {

        return ResponseEntity.accepted().body(authService.register(request));
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponseDto> authenticate (
            @RequestBody @Valid AuthenticationRequestDto request
    ) {
        return ResponseEntity.ok(authService.authenticate(request));
    }

    @GetMapping("/user")
    public ResponseEntity<AuthenticatedUserResponseDto> getCurrentUser(
            @RequestHeader("Authorization") String token
    ) {
        return ResponseEntity.ok(userService.findByToken(token));
    }

    @GetMapping("/refresh-token")
    public ResponseEntity<JwtTokenResponseDto> refreshToken(
            @RequestHeader("Authorization") String token
    )  {
        return ResponseEntity.ok(authService.refreshToken(token));
    }
}
