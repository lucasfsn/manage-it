package com.manageit.manageit.feature.project.validation;

import com.manageit.manageit.feature.project.dto.CreateProjectRequestDto;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class EndDateAfterStartDateForCreateValidator implements ConstraintValidator<EndDateAfterStartDate, CreateProjectRequestDto> {

    @Override
    public boolean isValid(CreateProjectRequestDto request, ConstraintValidatorContext context) {
        if (request.getStartDate() == null || request.getEndDate() == null) {
            return true;
        }
        return request.getEndDate().isAfter(request.getStartDate());
    }
}