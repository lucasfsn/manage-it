package com.manageit.manageit.exception;

public class UnauthorizedProjectAccessException extends RuntimeException {
    public UnauthorizedProjectAccessException(String message) {
        super(message);
    }
}