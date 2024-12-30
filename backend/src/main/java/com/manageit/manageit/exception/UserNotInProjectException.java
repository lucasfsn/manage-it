package com.manageit.manageit.exception;

public class UserNotInProjectException extends RuntimeException {
    public UserNotInProjectException(String message) {
        super(message);
    }
}