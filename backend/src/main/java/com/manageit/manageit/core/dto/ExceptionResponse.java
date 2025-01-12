package com.manageit.manageit.core.dto;


import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Set;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class ExceptionResponse {

    private LocalDateTime timestamp;
    private HttpStatus httpStatus;
    private String errorDescription;
    private String message;
    private Set<String> validationErrors;
    private Map<String, String> errors;
}
