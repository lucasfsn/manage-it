package com.manageit.manageit.feature.project.validation;

import com.manageit.manageit.feature.project.dto.CreateProjectRequest;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

//public class EndDateAfterStartDateForCreateValidator implements ConstraintValidator<EndDateAfterStartDate, CreateProjectRequest> {
//
//    @Override
//    public void initialize(EndDateAfterStartDate constraintAnnotation) {
//
//    }
//
//    @Override
//    public boolean isValid(CreateProjectRequest request, ConstraintValidatorContext context) {
//        if (request.getStartDate() == null || request.getEndDate() == null) {
//            return true;
//        }
//
//        boolean isValid = request.getEndDate().isAfter(request.getStartDate());
//
//        if (!isValid) {
//            context.disableDefaultConstraintViolation();
//            context.buildConstraintViolationWithTemplate("End date must be after start date")
//                    .addPropertyNode("endDate")
//                    .addConstraintViolation();
//        }
//
//        return isValid;
//    }
//}

public class EndDateAfterStartDateForCreateValidator implements ConstraintValidator<EndDateAfterStartDate, CreateProjectRequest> {

    @Override
    public boolean isValid(CreateProjectRequest request, ConstraintValidatorContext context) {
        if (request.getStartDate() == null || request.getEndDate() == null) {
            return true;
        }
        return request.getEndDate().isAfter(request.getStartDate());
    }
}