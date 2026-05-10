package com.clms.common.config;

import io.github.bucket4j.Bucket;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Configuration
public class Bucket4jConfig {

    @Bean
    public Map<String, Bucket> ipBucketCache() {
        return new ConcurrentHashMap<>();
    }
}
