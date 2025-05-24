package com.manageit.manageit.shared.dto;

import com.manageit.manageit.shared.enums.ErrorCode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FieldValidationErrorsDto {
    private ErrorCode errorCode;
    private String field;
    private String message;
}
