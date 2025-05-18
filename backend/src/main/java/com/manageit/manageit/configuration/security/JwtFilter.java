package com.manageit.manageit.configuration.security;

import com.manageit.manageit.core.exception.JwtAuthenticationException;
import com.manageit.manageit.feature.user.model.User;
import com.manageit.manageit.feature.user.service.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserService userService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        String path = request.getServletPath();
        if (path.equals("/auth/register") || path.equals("/auth/authenticate") || path.equals("/auth/refresh-token")) {
            filterChain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (authHeader == null && request.getQueryString() != null && request.getQueryString().startsWith("token=Bearer")) {
            authHeader = request.getQueryString().replace("token=Bearer%20", "Bearer ");
        }

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String jwt = authHeader.substring(7);
        final String userId;

        String tokenType = jwtService.extractClaim(jwt, claims -> (String) claims.get("type"));
        if (tokenType == null || !tokenType.equals("access")) {
            throw new JwtAuthenticationException("Invalid JWT token");
        }

        try {
            userId = jwtService.extractUserId(jwt);
        } catch (Exception e) {
            throw new JwtAuthenticationException("Invalid JWT token", e);
        }

        if (userId != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            User user = userService.getUserOrThrow(userId);
            if (jwtService.isTokenValid(jwt, user)) {
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        user,
                        null,
                        user.getAuthorities()
                );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            } else {
                throw new JwtAuthenticationException("Invalid JWT token");
            }
        }

        filterChain.doFilter(request, response);
    }
}