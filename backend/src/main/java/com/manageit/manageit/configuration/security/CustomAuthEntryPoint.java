package com.manageit.manageit.configuration.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.manageit.manageit.shared.dto.ResponseDto;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class CustomAuthEntryPoint implements AuthenticationEntryPoint {

    private final ObjectMapper mapper;

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException {


        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType("application/json");
        String json = mapper.writeValueAsString(new ResponseDto<>(
                HttpStatus.UNAUTHORIZED.value(),
                "Unauthorized",
                LocalDateTime.now(),
                null
        ));

        response.getWriter().write(json);
    }
}
