package com.manageit.manageit.shared.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FieldValidationErrorsDto {
    private HttpStatus errorCode;
    private String field;
    private String message;
}
