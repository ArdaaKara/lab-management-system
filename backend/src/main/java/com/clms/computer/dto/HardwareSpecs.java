package com.clms.computer.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record HardwareSpecs(
        @JsonProperty("cpu") String cpu,
        @JsonProperty("ram_gb") int ramGb,
        @JsonProperty("disk_gb") int diskGb,
        @JsonProperty("os") String os
) {}
