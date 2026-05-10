package com.clms.common.exception;

import org.springframework.http.HttpStatus;

public class RateLimitException extends AppException {
    public RateLimitException() {
        super("Çok fazla istek gönderildi. Lütfen bir dakika sonra tekrar deneyin.", HttpStatus.TOO_MANY_REQUESTS);
    }
}
