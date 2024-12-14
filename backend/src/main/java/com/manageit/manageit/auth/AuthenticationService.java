package com.manageit.manageit.auth;

import com.manageit.manageit.security.JwtService;
import com.manageit.manageit.model.user.User;
import com.manageit.manageit.mapper.user.UserMapper;
import com.manageit.manageit.repository.UserRepository;
import com.manageit.manageit.dto.user.AuthenticatedUserResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserMapper userMapper;

    public AuthenticationResponse register(@Valid RegisterRequest request) {
        User user = User.builder()
                .firstName(request.getFirstName())
                .username(request.getUsername())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
//                .role(Role.USER)
                .build();
        repository.save(user);
        AuthenticatedUserResponse authenticatedUserResponse = userMapper.toAuthenticatedUserResponse(user);
        String jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder().token(jwtToken).user(authenticatedUserResponse).build();
    }

    public AuthenticationResponse authenticate(@Valid AuthenticationRequest request) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        User user = ((User) auth.getPrincipal());
        AuthenticatedUserResponse authenticatedUserResponse = userMapper.toAuthenticatedUserResponse(user);
        String jwtToken  = jwtService.generateToken(user);
        return AuthenticationResponse.builder().token(jwtToken).user(authenticatedUserResponse).build();
    }

}
