package com.manageit.manageit.core.exception;

public class ProjectModificationNotAllowedException extends RuntimeException {
    public ProjectModificationNotAllowedException(String message) {
        super(message);
    }
}
