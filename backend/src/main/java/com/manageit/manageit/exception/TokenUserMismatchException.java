package com.manageit.manageit.exception;

public class TokenUserMismatchException extends RuntimeException {
    public TokenUserMismatchException(String message) {
        super(message);
    }
}