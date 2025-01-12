package com.manageit.manageit.core.exception;

public class UserNotInTaskException extends RuntimeException {
    public UserNotInTaskException(String message) {
        super(message);
    }
}
