package com.manageit.manageit.exception;

public class UserNotInTaskException extends RuntimeException {
    public UserNotInTaskException(String message) {
        super(message);
    }
}
