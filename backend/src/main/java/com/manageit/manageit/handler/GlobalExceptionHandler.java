package com.manageit.manageit.handler;

//import jakarta.validation.ConstraintViolationException;
import jakarta.persistence.EntityNotFoundException;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import static com.manageit.manageit.handler.Error.*;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ExceptionResponse> handleException(BadCredentialsException exp) {
        return ResponseEntity
                .status(BAD_CREDENTIALS.getHttpStatus())
                .body(
                        ExceptionResponse.builder()
                                .timestamp(LocalDateTime.now())
                                .httpStatus(BAD_CREDENTIALS.getHttpStatus())
                                .errorDescription(BAD_CREDENTIALS.getDescription())
                                .error(exp.getMessage())
                                .build()
                );
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ExceptionResponse> handleException(EntityNotFoundException exp) {
        String errorDescription = ENTITY_NOT_FOUND.getDescription();
        if (exp.getMessage() != null && !exp.getMessage().isEmpty()) {
            errorDescription = exp.getMessage();
        }
        return ResponseEntity
                .status(ENTITY_NOT_FOUND.getHttpStatus())
                .body(
                        ExceptionResponse.builder()
                                .timestamp(LocalDateTime.now())
                                .httpStatus(ENTITY_NOT_FOUND.getHttpStatus())
                                .errorDescription(errorDescription)
                                .error(exp.getMessage())
                                .build()
                );
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ExceptionResponse> handleException(MethodArgumentNotValidException exp) {
        Set<String> errors = new HashSet<>();
        exp.getBindingResult().getAllErrors().forEach(err -> errors.add(err.getDefaultMessage()));
        return ResponseEntity
                .status(VALIDATION_ERROR.getHttpStatus())
                .body(
                        ExceptionResponse.builder()
                                .timestamp(LocalDateTime.now())
                                .httpStatus(VALIDATION_ERROR.getHttpStatus())
                                .errorDescription(VALIDATION_ERROR.getDescription())
                                .error(errors.iterator().next())
                                .validationErrors(errors)
                                .build()
                );
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ExceptionResponse> handleDataIntegrityViolationException(DataIntegrityViolationException exp) {
        String errorDescription = DATA_INTEGRITY_VIOLATION.getDescription();
        if (exp.getCause() instanceof ConstraintViolationException constraintException) {
            String constraintName = constraintException.getConstraintName();
            if ("users_email_key".equals(constraintName)) {
                errorDescription = "Email already exsists";
            } else if ("users_username_key".equals(constraintName)) {
                errorDescription = "Username already exsists";
            }
        }
        return ResponseEntity
                .status(DATA_INTEGRITY_VIOLATION.getHttpStatus())
                .body(
                        ExceptionResponse.builder()
                                .timestamp(LocalDateTime.now())
                                .httpStatus(DATA_INTEGRITY_VIOLATION.getHttpStatus())
                                .errorDescription(errorDescription)
                                .error(exp.getMessage())
                                .build()
                );
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ExceptionResponse> handleException(Exception exp) {
        exp.printStackTrace();
        return ResponseEntity
                .status(INTERNAL_ERROR.getHttpStatus())
                .body(
                        ExceptionResponse.builder()
                                .timestamp(LocalDateTime.now())
                                .errorDescription(INTERNAL_ERROR.getDescription())
                                .error(exp.getMessage())
                                .build()
                );
    }
}
