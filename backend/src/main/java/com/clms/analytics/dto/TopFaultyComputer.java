package com.clms.analytics.dto;

public record TopFaultyComputer(
        String computerId,
        String hostname,
        String assetTag,
        long issueCount
) {}
