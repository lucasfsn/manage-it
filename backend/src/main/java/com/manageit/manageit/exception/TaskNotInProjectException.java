package com.manageit.manageit.exception;

import java.util.UUID;

public class TaskNotInProjectException  extends RuntimeException {
    public TaskNotInProjectException(UUID taskId, UUID projectId) {
        super(String.format("The task with ID '%s' does not belong to the project with ID '%s'.", taskId, projectId));
    }
}