package com.manageit.manageit.auth;

import com.manageit.manageit.configuration.security.JwtService;
import com.manageit.manageit.core.exception.JwtAuthenticationException;
import com.manageit.manageit.feature.user.model.User;
import com.manageit.manageit.feature.user.mapper.UserMapper;
import com.manageit.manageit.feature.user.repository.UserRepository;
import com.manageit.manageit.feature.user.dto.AuthenticatedUserResponseDto;
import com.manageit.manageit.jwt.builder.JwtTokenParser;
import com.manageit.manageit.jwt.dto.JwtTokenResponseDto;
import com.manageit.manageit.jwt.model.JwtToken;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserMapper userMapper;
    private final JwtTokenParser jwtTokenParser;

    public AuthenticationResponse register(@Valid RegisterRequest request) {
        User user = User.builder()
                .firstName(request.getFirstName())
                .username(request.getUsername())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();
        User savedUser = repository.save(user);
        AuthenticatedUserResponseDto authenticatedUserResponseDto = userMapper.toAuthenticatedUserResponse(user);
        JwtToken jwtToken = jwtService.generateToken(savedUser);
        JwtToken refreshToken = jwtService.generateRefreshToken(savedUser);
        return AuthenticationResponse.builder().accessToken(jwtToken.getToken()).refreshToken(refreshToken.getToken()).user(authenticatedUserResponseDto).build();
    }

    public AuthenticationResponse authenticate(@Valid AuthenticationRequest request) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        User user = ((User) auth.getPrincipal());
        AuthenticatedUserResponseDto authenticatedUserResponseDto = userMapper.toAuthenticatedUserResponse(user);
        JwtToken jwtToken  = jwtService.generateToken(user);
        JwtToken refreshToken = jwtService.generateRefreshToken(user);
        return AuthenticationResponse.builder().accessToken(jwtToken.getToken()).refreshToken(refreshToken.getToken()).user(authenticatedUserResponseDto).build();
    }

    public JwtTokenResponseDto refreshToken(String refreshToken) {
        JwtToken jwtToken = jwtTokenParser.parse(refreshToken);
        String userId = jwtToken.getSubject();


        User user = repository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new JwtAuthenticationException("Invalid JWT token"));

        if (!jwtService.isTokenValid(jwtToken, user)) {
            throw new JwtAuthenticationException("Invalid JWT token");
        }

        JwtToken accessToken = jwtService.generateToken(user);
        return new JwtTokenResponseDto(accessToken.getToken(), jwtToken.getToken());
    }
}
