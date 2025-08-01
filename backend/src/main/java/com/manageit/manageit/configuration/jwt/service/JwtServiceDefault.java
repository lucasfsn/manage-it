package com.manageit.manageit.configuration.jwt.service;

import com.manageit.manageit.configuration.jwt.builder.JwtTokenParser;
import com.manageit.manageit.configuration.jwt.model.JwtToken;
import com.manageit.manageit.feature.user.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;

@Service
@RequiredArgsConstructor
public class JwtServiceDefault implements JwtService {

    @Value("${application.security.jwt.expiration}")
    private long jwtExpiration;
    @Value("${application.security.jwt.refresh-token.expiration}")
    private long jwtRefreshExpiration;
    @Value("${application.security.jwt.secret-key}")
    private String secretKey;
    private final JwtTokenParser jwtTokenParser;

    @Override
    public String extractUserId(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    @Override
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    @Override
    public JwtToken generateToken(User userDetails) {
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("type", "access");
        return generateToken(extraClaims, userDetails);
    }

    @Override
    public JwtToken generateToken(Map<String, Object> extraClaims, User userDetails) {
        JwtBuilder token = buildToken(extraClaims, userDetails, jwtExpiration);
        return jwtTokenParser.parse(token);
    }

    @Override
    public JwtToken generateRefreshToken(UserDetails userDetails) {
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("type", "refresh");
        JwtBuilder token = buildToken(extraClaims, (User) userDetails, jwtRefreshExpiration);
        return jwtTokenParser.parse(token);
    }

    @Override
    public boolean isTokenValid(JwtToken jwtToken, User user) {
        UUID userId = UUID.fromString(jwtToken.getSubject());
        return (userId.equals(user.getId())) && !isTokenExpired(jwtToken);
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private JwtBuilder buildToken(
            Map<String, Object> extraClaims,
            User userDetails,
            long jwtExpiration
    ) {
        long jwtExpirationMillis = jwtExpiration * 1000;
        List<String> authorities = userDetails.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .toList();
        return Jwts
                .builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getId().toString())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMillis))
                .claim("authorities", authorities)
                .signWith(getSignInKey(), SignatureAlgorithm.HS256);
    }

    private Claims extractAllClaims(String token) {
        return Jwts
                .parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();

    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private boolean isTokenExpired(JwtToken token) {
        return token.getExpiration().before(new Date());
    }

    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
