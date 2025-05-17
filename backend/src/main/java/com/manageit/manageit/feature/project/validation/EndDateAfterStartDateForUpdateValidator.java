package com.manageit.manageit.feature.project.validation;

import com.manageit.manageit.feature.project.dto.UpdateProjectRequest;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

//public class EndDateAfterStartDateForUpdateValidator implements ConstraintValidator<EndDateAfterStartDateForUpdate, UpdateProjectRequest> {
//
//    @Override
//    public void initialize(EndDateAfterStartDateForUpdate constraintAnnotation) {
//
//    }
//
//    @Override
//    public boolean isValid(UpdateProjectRequest request, ConstraintValidatorContext context) {
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

public class EndDateAfterStartDateForUpdateValidator implements ConstraintValidator<EndDateAfterStartDate, UpdateProjectRequest> {

    @Override
    public boolean isValid(UpdateProjectRequest request, ConstraintValidatorContext context) {
        if (request.getStartDate() == null || request.getEndDate() == null) {
            return true;
        }
        return request.getEndDate().isAfter(request.getStartDate());
    }
}