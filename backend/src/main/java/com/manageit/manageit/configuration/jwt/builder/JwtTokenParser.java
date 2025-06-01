package com.manageit.manageit.configuration.jwt.builder;

import com.manageit.manageit.configuration.jwt.model.JwtToken;
import com.manageit.manageit.core.exception.JwtAuthenticationException;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;

@Component
public class JwtTokenParser {

    @Value("${application.security.jwt.secret-key}")
    private String secretKey;

    public JwtToken parse(String jwtString) {
        if (jwtString == null || !jwtString.startsWith("Bearer ")) {
            throw new JwtAuthenticationException("Invalid JWT token");
        }

        String token = jwtString.substring(7);
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();

        return new JwtToken(claims, token);
    }

    public JwtToken parse(JwtBuilder jwtBuilder) {
        String token = jwtBuilder.compact();
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();

        return new JwtToken(claims, token);
    }

    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
