package com.manageit.manageit.core.exception;

public class TaskDueDateExceedsProjectEndDateException extends RuntimeException {
    public TaskDueDateExceedsProjectEndDateException(String message) {
        super(message);
    }
}
