package com.manageit.manageit.core.dto;


import com.manageit.manageit.shared.dto.FieldValidationErrorsDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class ErrorResponseDto {
    private Integer code;
    private String message;

    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();
    private List<FieldValidationErrorsDto> errors;
}
