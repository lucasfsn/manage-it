package com.manageit.manageit.core.dto;

import lombok.Getter;
import org.springframework.http.HttpStatus;

import static org.springframework.http.HttpStatus.*;

@Getter
public enum Error {
    BAD_CREDENTIALS(UNAUTHORIZED, "Email and Password is incorrect."),
    VALIDATION_ERROR(BAD_REQUEST, "Validation failed for one or more arguments."),
    DATA_INTEGRITY_VIOLATION(CONFLICT, "Data already exsist."),
    INTERNAL_ERROR(INTERNAL_SERVER_ERROR, "Internal Server Error."),
    ENTITY_NOT_FOUND(NOT_FOUND, "Entity not found."),
    TOKEN_MISMATCH(UNAUTHORIZED, "The user provided does not match the user in the token."),
    INSUFFICIENT_PERMISSIONS(UNAUTHORIZED, "User does not have sufficient permissions to perform this action"),
    TASK_NOT_IN_PROJECT(BAD_REQUEST, "The specified task does not belong to the project."),
    ILLEGAL_STATE(CONFLICT, "The operation could not be performed due to an illegal state");

    private final String description;
    private final HttpStatus httpStatus;

    Error(HttpStatus httpStatus, String description) {
        this.description = description;
        this.httpStatus = httpStatus;
    }
}
