package com.manageit.manageit.core.exception;

public class TokenUserMismatchException extends RuntimeException {
    public TokenUserMismatchException(String message) {
        super(message);
    }
}