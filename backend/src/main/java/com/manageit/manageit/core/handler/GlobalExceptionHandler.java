package com.manageit.manageit.core.handler;

import com.manageit.manageit.core.dto.ErrorResponseDto;
import com.manageit.manageit.core.exception.TaskNotInProjectException;
import com.manageit.manageit.core.exception.TokenUserMismatchException;
import com.manageit.manageit.core.exception.UserNotInProjectException;
import com.manageit.manageit.core.exception.UserNotInTaskException;
import com.manageit.manageit.shared.dto.FieldValidationErrorsDto;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.annotation.Nonnull;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Path;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.ConversionNotSupportedException;
import org.springframework.beans.TypeMismatchException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingPathVariableException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler({UserNotInProjectException.class, UserNotInTaskException.class})
    public ResponseEntity<ErrorResponseDto> handleException(RuntimeException exp) {
        if (log.isErrorEnabled()) {
            log.error(exp.getMessage(), exp);
        }

        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(
                        ErrorResponseDto.builder()
                                .code(HttpStatus.FORBIDDEN.getReasonPhrase())
                                .message(exp.getMessage())
                                .build()
                );
    }

    @ExceptionHandler(TaskNotInProjectException.class)
    public ResponseEntity<ErrorResponseDto> handleException(TaskNotInProjectException exp) {
        if (log.isErrorEnabled()) {
            log.error(exp.getMessage(), exp);
        }

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(
                        ErrorResponseDto.builder()
                                .code(HttpStatus.BAD_REQUEST.getReasonPhrase())
                                .message(exp.getMessage())
                                .build()
                );
    }


    @ExceptionHandler({BadCredentialsException.class, ExpiredJwtException.class, TokenUserMismatchException.class})
    public ResponseEntity<Void> handleUnauthorizedException(RuntimeException exp) {
        if (log.isErrorEnabled()) {
            log.error(exp.getMessage(), exp);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ErrorResponseDto> handleException(EntityNotFoundException exp) {
        if (log.isErrorEnabled()) {
            log.error(exp.getMessage(), exp);
        }

        final ErrorResponseDto response = ErrorResponseDto.builder()
                .code(HttpStatus.BAD_REQUEST.getReasonPhrase())
                .message(exp.getMessage())
                .build();

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(response);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponseDto> handleException(MethodArgumentNotValidException exp) {
        if (log.isErrorEnabled()) {
            log.error(exp.getMessage(), exp);
        }
        List<FieldValidationErrorsDto> validationErrors = exp.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> new FieldValidationErrorsDto(
                        HttpStatus.BAD_REQUEST,
                        error.getField(),
                        error.getDefaultMessage()
                ))
                .toList();
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(
                        ErrorResponseDto.builder()
                                .code(HttpStatus.BAD_REQUEST.getReasonPhrase())
                                .message("Validation failed")
                                .errors(validationErrors)
                                .build()
                );
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponseDto> handleException(DataIntegrityViolationException exp) {
        if (log.isErrorEnabled()) {
            log.error(exp.getMessage(), exp);
        }
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(
                        ErrorResponseDto.builder()
                                .code(HttpStatus.CONFLICT.getReasonPhrase())
                                .message("Data integrity violation occurred.")
                                .build()
                );
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ErrorResponseDto> handleException(IllegalStateException exp) {
        if (log.isErrorEnabled()) {
            log.error(exp.getMessage(), exp);
        }
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(
                        ErrorResponseDto.builder()
                                .code(HttpStatus.CONFLICT.getReasonPhrase())
                                .message(exp.getMessage())
                                .build()
                );
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponseDto> handleHttpMessageNotReadableException(HttpMessageNotReadableException exp) {
        if (log.isErrorEnabled()) {
            log.error(exp.getMessage(), exp);
        }
        final String message = "Invalid request body format or value.";
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(
                        ErrorResponseDto.builder()
                                .code(HttpStatus.BAD_REQUEST.getReasonPhrase())
                                .message(message)
                                .build()
                );
    }

    @ExceptionHandler({ConstraintViolationException.class})
    public ResponseEntity<Object> handleConstraintViolationException(
            final ConstraintViolationException exception, final ServletWebRequest request) {
        if (log.isErrorEnabled()) {
            log.error(exception.getMessage(), exception);
        }
        final List<FieldValidationErrorsDto> invalidParameters =
                processInvalidParameters(exception);

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                ErrorResponseDto.builder()
                        .code(HttpStatus.BAD_REQUEST.getReasonPhrase())
                        .message("Validation failed")
                        .errors(invalidParameters)
                        .build()
        );
    }


    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponseDto> handleException(Exception exp) {
        if (log.isErrorEnabled()) {
            log.error(exp.getMessage(), exp);
        }
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(
                        ErrorResponseDto.builder()
                                .code(HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase())
                                .message(exp.getMessage())
                                .build()
                );
    }


    @Override
    public ResponseEntity<Object> handleTypeMismatch(
            @Nonnull TypeMismatchException exception,
            @Nonnull HttpHeaders headers,
            @Nonnull HttpStatusCode status,
            @Nonnull WebRequest request) {
        if (log.isErrorEnabled()) {
            log.error(exception.getMessage(), exception);
        }
        String parameter = exception.getPropertyName();
        if (exception instanceof MethodArgumentTypeMismatchException castedException) {
            parameter = castedException.getName();
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                ErrorResponseDto.builder()
                        .code(HttpStatus.BAD_REQUEST.getReasonPhrase())
                        .message("Unexpected type specified")
                        .errors(List.of(
                                new FieldValidationErrorsDto(
                                        HttpStatus.BAD_REQUEST, parameter, "Unexpected type")))
                        .build());
    }

    @Override
    public ResponseEntity<Object> handleConversionNotSupported(
            @Nonnull final ConversionNotSupportedException exception,
            @Nonnull final HttpHeaders headers,
            @Nonnull final HttpStatusCode status,
            @Nonnull final WebRequest request) {
        if (log.isErrorEnabled()) {
            log.error(exception.getMessage(), exception);
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                ErrorResponseDto.builder()
                        .code(HttpStatus.BAD_REQUEST.getReasonPhrase())
                        .message(String.format(
                                "Failed to convert %s with value %s",
                                exception.getPropertyName(), exception.getRequiredType()))
                        .build()
        );
    }

    @Override
    public ResponseEntity<Object> handleMissingPathVariable(
            @Nonnull MissingPathVariableException exception,
            @Nonnull HttpHeaders headers,
            @Nonnull HttpStatusCode status,
            @Nonnull WebRequest request) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                ErrorResponseDto.builder()
                        .code(HttpStatus.BAD_REQUEST.getReasonPhrase())
                        .message(exception.getMessage())
                        .build()
        );
    }

    @Override
    public ResponseEntity<Object> handleHttpMediaTypeNotSupported(
            @Nonnull HttpMediaTypeNotSupportedException exception,
            @Nonnull final HttpHeaders headers,
            @Nonnull final HttpStatusCode status,
            @Nonnull final WebRequest request) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                ErrorResponseDto.builder()
                        .code(HttpStatus.BAD_REQUEST.getReasonPhrase())
                        .message(exception.getMessage())
                        .build()
        );

    }

    @Override
    public ResponseEntity<Object> handleHttpRequestMethodNotSupported(
            @Nonnull final HttpRequestMethodNotSupportedException exception,
            @Nonnull final HttpHeaders headers,
            @Nonnull final HttpStatusCode status,
            @Nonnull final WebRequest request) {
        return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).body(
                ErrorResponseDto.builder()
                        .code(HttpStatus.METHOD_NOT_ALLOWED.getReasonPhrase())
                        .message(exception.getMessage())
                        .build());
    }

    private List<FieldValidationErrorsDto> processInvalidParameters(
            ConstraintViolationException exception) {
        final List<FieldValidationErrorsDto> invalidParameters = new ArrayList<>();
        exception
                .getConstraintViolations()
                .forEach(
                        constraintViolation -> {
                            Path propertyPath = constraintViolation.getPropertyPath();
                            List<String> path = new ArrayList<>();
                            propertyPath.forEach(property -> path.add(property.toString()));
                            final FieldValidationErrorsDto errors = new FieldValidationErrorsDto();
                            errors.setErrorCode(HttpStatus.BAD_REQUEST);
                            errors.setField(path.getLast());
                            errors.setMessage(constraintViolation.getMessage());
                            invalidParameters.add(errors);
                        });
        return invalidParameters;
    }

}
