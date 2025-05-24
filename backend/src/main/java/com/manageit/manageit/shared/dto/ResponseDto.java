package com.manageit.manageit.shared.dto;

import com.manageit.manageit.shared.enums.SuccessCode;
import java.time.LocalDateTime;



public record ResponseDto<T>(
        Integer code,
        String message,
        LocalDateTime timestamp,
        T data) {

    public ResponseDto(SuccessCode code, String message, T data) {
        this(code.getCode(), message, LocalDateTime.now(), data);
    }
}

