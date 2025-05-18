package com.manageit.manageit.core.handler;

import com.manageit.manageit.core.dto.ExceptionResponseDto;
import com.manageit.manageit.core.exception.TaskNotInProjectException;
import com.manageit.manageit.core.exception.TokenUserMismatchException;
import com.manageit.manageit.core.exception.UserNotInProjectException;
import com.manageit.manageit.core.exception.UserNotInTaskException;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import static com.manageit.manageit.core.dto.Error.*;
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ExceptionResponse> handleMethodArgumentTypeMismatch(MethodArgumentTypeMismatchException ex) {

        if (ex.getRequiredType() != null && ex.getRequiredType().equals(UUID.class)) {
            String name = ex.getName();
            String value = ex.getValue() != null ? ex.getValue().toString() : "null";

            if (log.isErrorEnabled()) {
                log.error("Invalid UUID format: {} = {}", name, value, ex);
            }

            String message = String.format("Parameter '%s' should be a valid UUID, but the value '%s' could not be parsed.",
                    name, value);

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(
                            ExceptionResponse.builder()
                                    .timestamp(LocalDateTime.now())
                                    .httpStatus(HttpStatus.BAD_REQUEST)
                                    .errorDescription("Invalid UUID format")
                                    .message(message)
                                    .build()
                    );
        }

        return handleException(ex);
    }

    @ExceptionHandler(TokenUserMismatchException.class)
    public ResponseEntity<ExceptionResponseDto> handleException(TokenUserMismatchException exp) {

        return ResponseEntity.status(TOKEN_MISMATCH.getHttpStatus())
                .body(
                        ExceptionResponseDto.builder()
                                .timestamp(LocalDateTime.now())
                                .httpStatus(TOKEN_MISMATCH.getHttpStatus())
                                .errorDescription(exp.getMessage())
                                .message(TOKEN_MISMATCH.getDescription())
                                .build()
                );
    }

    @ExceptionHandler({UserNotInProjectException.class, UserNotInTaskException.class})
    public ResponseEntity<ExceptionResponseDto> handleException(RuntimeException exp) {
        if (log.isErrorEnabled()) {
            log.error(exp.getMessage(), exp);
        }
        String message = INSUFFICIENT_PERMISSIONS.getDescription();
        if (exp.getMessage() != null && !exp.getMessage().isEmpty()) {
            message = exp.getMessage();
        }
        return ResponseEntity
                .status(INSUFFICIENT_PERMISSIONS.getHttpStatus())
                .body(
                        ExceptionResponseDto.builder()
                                .timestamp(LocalDateTime.now())
                                .httpStatus(INSUFFICIENT_PERMISSIONS.getHttpStatus())
                                .errorDescription(exp.getMessage())
                                .message(message)
                                .build()
                );
    }

    @ExceptionHandler(TaskNotInProjectException.class)
    public ResponseEntity<ExceptionResponseDto> handleException(TaskNotInProjectException exp) {
        if (log.isErrorEnabled()) {
            log.error(exp.getMessage(), exp);
        }
        String message = TASK_NOT_IN_PROJECT.getDescription();
        if (exp.getMessage() != null && !exp.getMessage().isEmpty()) {
            message = exp.getMessage();
        }
        return ResponseEntity
                .status(TASK_NOT_IN_PROJECT.getHttpStatus())
                .body(
                        ExceptionResponseDto.builder()
                                .timestamp(LocalDateTime.now())
                                .httpStatus(TASK_NOT_IN_PROJECT.getHttpStatus())
                                .errorDescription(exp.getMessage())
                                .message(message)
                                .build()
                );
    }

    @ExceptionHandler(ExpiredJwtException.class)
    public ResponseEntity<Void> handleException() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }



    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ExceptionResponseDto> handleException(BadCredentialsException exp) {
        if (log.isErrorEnabled()) {
            log.error(exp.getMessage(), exp);
        }
        return ResponseEntity
                .status(BAD_CREDENTIALS.getHttpStatus())
                .body(
                        ExceptionResponseDto.builder()
                                .timestamp(LocalDateTime.now())
                                .httpStatus(BAD_CREDENTIALS.getHttpStatus())
                                .errorDescription(exp.getMessage())
                                .message(BAD_CREDENTIALS.getDescription())
                                .build()
                );
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ExceptionResponseDto> handleException(EntityNotFoundException exp) {
        if (log.isErrorEnabled()) {
            log.error(exp.getMessage(), exp);
        }
        String message = ENTITY_NOT_FOUND.getDescription();
        if (exp.getMessage() != null && !exp.getMessage().isEmpty()) {
            message = exp.getMessage();
        }
        return ResponseEntity
                .status(ENTITY_NOT_FOUND.getHttpStatus())
                .body(
                        ExceptionResponseDto.builder()
                                .timestamp(LocalDateTime.now())
                                .httpStatus(ENTITY_NOT_FOUND.getHttpStatus())
                                .errorDescription(exp.getMessage())
                                .message(message)
                                .build()
                );
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ExceptionResponseDto> handleException(MethodArgumentNotValidException exp) {
        if (log.isErrorEnabled()) {
            log.error(exp.getMessage(), exp);
        }
        Set<String> errors = new HashSet<>();
        exp.getBindingResult().getAllErrors().forEach(err -> errors.add(err.getDefaultMessage()));
        return ResponseEntity
                .status(VALIDATION_ERROR.getHttpStatus())
                .body(
                        ExceptionResponseDto.builder()
                                .timestamp(LocalDateTime.now())
                                .httpStatus(VALIDATION_ERROR.getHttpStatus())
                                .errorDescription(VALIDATION_ERROR.getDescription())
                                .message(errors.iterator().next())
                                .validationErrors(errors)
                                .build()
                );
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ExceptionResponseDto> handleDataIntegrityViolationException(DataIntegrityViolationException exp) {
        if (log.isErrorEnabled()) {
            log.error(exp.getMessage(), exp);
        }
        String message = DATA_INTEGRITY_VIOLATION.getDescription();
        if (exp.getCause() instanceof ConstraintViolationException constraintException) {
            String constraintName = constraintException.getConstraintName();
            if ("users_email_key".equals(constraintName)) {
                message = "Email already exists.";
            } else if ("users_username_key".equals(constraintName)) {
                message = "Username already exists.";
            }
        }
        return ResponseEntity
                .status(DATA_INTEGRITY_VIOLATION.getHttpStatus())
                .body(
                        ExceptionResponseDto.builder()
                                .timestamp(LocalDateTime.now())
                                .httpStatus(DATA_INTEGRITY_VIOLATION.getHttpStatus())
                                .errorDescription(exp.getMessage())
                                .message(message)
                                .build()
                );
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ExceptionResponseDto> handleException(IllegalStateException exp) {
        if (log.isErrorEnabled()) {
            log.error(exp.getMessage(), exp);
        }
        return ResponseEntity
                .status(ILLEGAL_STATE.getHttpStatus())
                .body(
                        ExceptionResponseDto.builder()
                                .timestamp(LocalDateTime.now())
                                .errorDescription(ILLEGAL_STATE.getDescription())
                                .message(exp.getMessage())
                                .build()
                );
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ExceptionResponse> handleHttpMessageNotReadableException(HttpMessageNotReadableException exp) {
        if (log.isErrorEnabled()) {
            log.error(exp.getMessage(), exp);
        }
        return ResponseEntity
                .status(INVALID_REQUEST_BODY.getHttpStatus())
                .body(
                        ExceptionResponse.builder()
                                .timestamp(LocalDateTime.now())
                                .httpStatus(INVALID_REQUEST_BODY.getHttpStatus())
                                .errorDescription(INVALID_REQUEST_BODY.getDescription())
                                .message(INVALID_REQUEST_BODY.getDescription())
                                .build()
                );
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ExceptionResponseDto> handleException(Exception exp) {
        if (log.isErrorEnabled()) {
            log.error(exp.getMessage(), exp);
        }
        return ResponseEntity
                .status(INTERNAL_ERROR.getHttpStatus())
                .body(
                        ExceptionResponseDto.builder()
                                .timestamp(LocalDateTime.now())
                                .errorDescription(INTERNAL_ERROR.getDescription())
                                .message(exp.getMessage())
                                .build()
                );
    }
}
