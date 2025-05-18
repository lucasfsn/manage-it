package com.manageit.manageit.feature.project.validation;

import com.manageit.manageit.feature.project.dto.UpdateProjectRequest;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class EndDateAfterStartDateForUpdateValidator implements ConstraintValidator<EndDateAfterStartDate, UpdateProjectRequest> {

    @Override
    public boolean isValid(UpdateProjectRequest request, ConstraintValidatorContext context) {
        if (request.getStartDate() == null || request.getEndDate() == null) {
            return true;
        }
        return request.getEndDate().isAfter(request.getStartDate());
    }
}