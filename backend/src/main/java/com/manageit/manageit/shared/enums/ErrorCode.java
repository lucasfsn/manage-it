package com.manageit.manageit.shared.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum ErrorCode {
    BAD_REQUEST(HttpStatus.BAD_REQUEST, "Bad request"),
    MISSING_REQUEST_PARAMETER(HttpStatus.BAD_REQUEST, "Missing request parameter"),
    MISSING_REQUEST_PART(HttpStatus.BAD_REQUEST, "Missing request part"),
    NOT_FOUND(HttpStatus.NOT_FOUND, "Not found"),
    CONVERSION_NOT_SUPPORTED(HttpStatus.BAD_REQUEST, "Conversion not supported");

    private final String name = name();
    private final HttpStatus httpStatus;
    private final String message;
}
