package com.manageit.manageit.feature.project.validation;

import com.manageit.manageit.feature.project.dto.UpdateProjectRequestDto;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class EndDateAfterStartDateForUpdateValidator implements ConstraintValidator<EndDateAfterStartDate, UpdateProjectRequestDto> {

    @Override
    public boolean isValid(UpdateProjectRequestDto request, ConstraintValidatorContext context) {
        if (request.getStartDate() == null || request.getEndDate() == null) {
            return true;
        }
        return request.getEndDate().isAfter(request.getStartDate());
    }
}