package com.manageit.manageit.configuration.jwt.filter;

import com.manageit.manageit.configuration.jwt.builder.JwtTokenParser;
import com.manageit.manageit.configuration.jwt.model.JwtToken;
import com.manageit.manageit.configuration.jwt.service.JwtService;
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
    private final JwtTokenParser jwtTokenParser;

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

        final JwtToken token = jwtTokenParser.parse(authHeader);

        if (token == null || !token.getType().equals("access")) {
            throw new JwtAuthenticationException("Invalid JWT token");
        }

        String userId = token.getSubject();

        if (userId != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            User user = userService.getUserOrThrow(userId);
            if (jwtService.isTokenValid(token, user)) {
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