package com.manageit.manageit.shared.enums;

import lombok.Getter;

@Getter
public enum SuccessCode {
    RESOURCE_CREATED(201),
    RESPONSE_SUCCESSFUL(200),
    RESOURCE_UPDATED(200),
    RESOURCE_DELETED(200),
    RESOURCE_NOT_FOUND(404),
    RESOURCE_RESTORED(200),
    ;

    private final int code;

    SuccessCode(int code) {
        this.code = code;
    }

}


