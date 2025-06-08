package com.manageit.manageit.core.exception;

public class UserNotOwnerOfProjectException extends RuntimeException {
    public UserNotOwnerOfProjectException(String message) {
        super(message);
    }
}