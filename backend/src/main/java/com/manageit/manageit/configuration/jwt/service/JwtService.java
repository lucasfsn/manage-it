package com.manageit.manageit.configuration.jwt.service;

import com.manageit.manageit.configuration.jwt.model.JwtToken;
import com.manageit.manageit.feature.user.model.User;
import io.jsonwebtoken.Claims;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Map;
import java.util.function.Function;

public interface JwtService {
    String extractUserId(String token);

    <T> T extractClaim(String token, Function<Claims, T> claimsResolver);

    JwtToken generateToken(User userDetails);

    JwtToken generateToken(Map<String, Object> extraClaims, User userDetails);

    JwtToken generateRefreshToken(UserDetails userDetails);

    boolean isTokenValid(JwtToken jwtToken, User user);
}
