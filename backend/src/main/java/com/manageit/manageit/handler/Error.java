package com.manageit.manageit.handler;

import lombok.Getter;
import org.springframework.http.HttpStatus;

import static org.springframework.http.HttpStatus.*;

@Getter
public enum Error {

    BAD_CREDENTIALS(UNAUTHORIZED, "Login and Password is incorrect."),
    VALIDATION_ERROR(BAD_REQUEST, "Validation failed for one or more arguments."),
    DATA_INTEGRITY_VIOLATION(CONFLICT, "Username or email already exsists."),
    INTERNAL_ERROR(INTERNAL_SERVER_ERROR, "Internal Server Error");
    //username exsist
    //email exsist
    private final String description;
    private final HttpStatus httpStatus;

    Error(HttpStatus httpStatus, String description) {
        this.description = description;
        this.httpStatus = httpStatus;
    }
}
