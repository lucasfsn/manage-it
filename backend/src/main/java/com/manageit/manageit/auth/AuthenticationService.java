package com.manageit.manageit.auth;

import com.manageit.manageit.security.JwtService;
import com.manageit.manageit.user.User;
import com.manageit.manageit.user.UserMapper;
import com.manageit.manageit.user.UserRepository;
import com.manageit.manageit.user.UserResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

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
        UserResponse userResponse = userMapper.toUserResponse(user);
        String jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder().token(jwtToken).user(userResponse).build();
    }

    public AuthenticationResponse authenticate(@Valid AuthenticationRequest request) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        User user = ((User) auth.getPrincipal());
        System.out.println(passwordEncoder.matches("1qazXSW@", "$2a$10$MeWNPKLaC9vi/2KdQqJ77.5HyoLqlkH/E8ZGzug2jXlZJgKYmGWYG"));
        System.out.println(passwordEncoder.matches("1qazXSW@", "$2a$10$ELfpGPOQhBkxcmRB.7rpAeapvsEbRVVWTwDemrjlo/dHAFeS04Ni2"));
        UserResponse userResponse = userMapper.toUserResponse(user);
        String jwtToken  = jwtService.generateToken(user);
        return AuthenticationResponse.builder().token(jwtToken).user(userResponse).build();
    }

}
