package com.manageit.manageit.core.handler;

import com.manageit.manageit.core.dto.ExceptionResponse;
import com.manageit.manageit.core.exception.TaskNotInProjectException;
import com.manageit.manageit.core.exception.TokenUserMismatchException;
import com.manageit.manageit.core.exception.UserNotInProjectException;
import com.manageit.manageit.core.exception.UserNotInTaskException;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
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

import static com.manageit.manageit.core.dto.Error.*;
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {


    @ExceptionHandler(TokenUserMismatchException.class)
    public ResponseEntity<ExceptionResponse> handleException(TokenUserMismatchException exp) {

        return ResponseEntity.status(TOKEN_MISMATCH.getHttpStatus())
                .body(
                        ExceptionResponse.builder()
                                .timestamp(LocalDateTime.now())
                                .httpStatus(TOKEN_MISMATCH.getHttpStatus())
                                .errorDescription(exp.getMessage())
                                .message(TOKEN_MISMATCH.getDescription())
                                .build()
                );
    }

    @ExceptionHandler({UserNotInProjectException.class, UserNotInTaskException.class})
    public ResponseEntity<ExceptionResponse> handleException(RuntimeException exp) {
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
                        ExceptionResponse.builder()
                                .timestamp(LocalDateTime.now())
                                .httpStatus(INSUFFICIENT_PERMISSIONS.getHttpStatus())
                                .errorDescription(exp.getMessage())
                                .message(message)
                                .build()
                );
    }

    @ExceptionHandler(TaskNotInProjectException.class)
    public ResponseEntity<ExceptionResponse> handleException(TaskNotInProjectException exp) {
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
                        ExceptionResponse.builder()
                                .timestamp(LocalDateTime.now())
                                .httpStatus(TASK_NOT_IN_PROJECT.getHttpStatus())
                                .errorDescription(exp.getMessage())
                                .message(message)
                                .build()
                );
    }


    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ExceptionResponse> handleException(BadCredentialsException exp) {
        if (log.isErrorEnabled()) {
            log.error(exp.getMessage(), exp);
        }
        return ResponseEntity
                .status(BAD_CREDENTIALS.getHttpStatus())
                .body(
                        ExceptionResponse.builder()
                                .timestamp(LocalDateTime.now())
                                .httpStatus(BAD_CREDENTIALS.getHttpStatus())
                                .errorDescription(exp.getMessage())
                                .message(BAD_CREDENTIALS.getDescription())
                                .build()
                );
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ExceptionResponse> handleException(EntityNotFoundException exp) {
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
                        ExceptionResponse.builder()
                                .timestamp(LocalDateTime.now())
                                .httpStatus(ENTITY_NOT_FOUND.getHttpStatus())
                                .errorDescription(exp.getMessage())
                                .message(message)
                                .build()
                );
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ExceptionResponse> handleException(MethodArgumentNotValidException exp) {
        if (log.isErrorEnabled()) {
            log.error(exp.getMessage(), exp);
        }
        Set<String> errors = new HashSet<>();
        exp.getBindingResult().getAllErrors().forEach(err -> errors.add(err.getDefaultMessage()));
        return ResponseEntity
                .status(VALIDATION_ERROR.getHttpStatus())
                .body(
                        ExceptionResponse.builder()
                                .timestamp(LocalDateTime.now())
                                .httpStatus(VALIDATION_ERROR.getHttpStatus())
                                .errorDescription(VALIDATION_ERROR.getDescription())
                                .message(errors.iterator().next())
                                .validationErrors(errors)
                                .build()
                );
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ExceptionResponse> handleDataIntegrityViolationException(DataIntegrityViolationException exp) {
        if (log.isErrorEnabled()) {
            log.error(exp.getMessage(), exp);
        }
        String message = DATA_INTEGRITY_VIOLATION.getDescription();
        if (exp.getCause() instanceof ConstraintViolationException constraintException) {
            String constraintName = constraintException.getConstraintName();
            if ("users_email_key".equals(constraintName)) {
                message = "Email already exsists";
            } else if ("users_username_key".equals(constraintName)) {
                message = "Username already exsists";
            }
        }
        return ResponseEntity
                .status(DATA_INTEGRITY_VIOLATION.getHttpStatus())
                .body(
                        ExceptionResponse.builder()
                                .timestamp(LocalDateTime.now())
                                .httpStatus(DATA_INTEGRITY_VIOLATION.getHttpStatus())
                                .errorDescription(exp.getMessage())
                                .message(message)
                                .build()
                );
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ExceptionResponse> handleException(IllegalStateException exp) {
        if (log.isErrorEnabled()) {
            log.error(exp.getMessage(), exp);
        }
        return ResponseEntity
                .status(ILLEGAL_STATE.getHttpStatus())
                .body(
                        ExceptionResponse.builder()
                                .timestamp(LocalDateTime.now())
                                .errorDescription(ILLEGAL_STATE.getDescription())
                                .message(exp.getMessage())
                                .build()
                );
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ExceptionResponse> handleException(Exception exp) {
        if (log.isErrorEnabled()) {
            log.error(exp.getMessage(), exp);
        }
        return ResponseEntity
                .status(INTERNAL_ERROR.getHttpStatus())
                .body(
                        ExceptionResponse.builder()
                                .timestamp(LocalDateTime.now())
                                .errorDescription(INTERNAL_ERROR.getDescription())
                                .message(exp.getMessage())
                                .build()
                );
    }
}
