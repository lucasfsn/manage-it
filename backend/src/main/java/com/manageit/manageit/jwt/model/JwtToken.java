package com.manageit.manageit.jwt.model;

import io.jsonwebtoken.Claims;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Data

@SuppressWarnings("unchecked")
public class JwtToken {
    private String token;
    private String type;
    private String subject;
    private Date issuedAt;
    private Date expiration;
    private List<String> authorities;

    public JwtToken(Claims claims, String token) {
        this.token = token;
        this.type = claims.get("type", String.class);
        this.subject = claims.getSubject();
        this.issuedAt = claims.getIssuedAt();
        this.expiration = claims.getExpiration();
        this.authorities = claims.get("authorities", List.class);
    }
}
