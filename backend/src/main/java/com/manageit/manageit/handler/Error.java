package com.manageit.manageit.handler;

import lombok.Getter;
import org.springframework.http.HttpStatus;

import static org.springframework.http.HttpStatus.*;

@Getter
public enum Error {
    BAD_CREDENTIALS(UNAUTHORIZED, "Email and Password is incorrect."),
    VALIDATION_ERROR(BAD_REQUEST, "Validation failed for one or more arguments."),
    DATA_INTEGRITY_VIOLATION(CONFLICT, "Data already exsist"),
    INTERNAL_ERROR(INTERNAL_SERVER_ERROR, "Internal Server Error"),
    ENTITY_NOT_FOUND(NOT_FOUND, "Entity not found");

    private final String description;
    private final HttpStatus httpStatus;

    Error(HttpStatus httpStatus, String description) {
        this.description = description;
        this.httpStatus = httpStatus;
    }
}
