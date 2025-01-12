package com.manageit.manageit.core.exception;

public class UserNotInProjectException extends RuntimeException {
    public UserNotInProjectException(String message) {
        super(message);
    }
}