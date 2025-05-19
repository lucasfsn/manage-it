package com.manageit.manageit.jwt.service;

import com.manageit.manageit.feature.user.model.User;
import com.manageit.manageit.jwt.model.JwtToken;
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

    boolean isTokenValid(String token, User user);

    boolean isTokenValid(JwtToken jwtToken, User user);

}
