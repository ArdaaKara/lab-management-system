package com.clms.common.exception;

import org.springframework.http.HttpStatus;

public class ResourceNotFoundException extends AppException {
    public ResourceNotFoundException(String resource, String identifier) {
        super(String.format("%s bulunamadı: %s", resource, identifier), HttpStatus.NOT_FOUND);
    }
}
