package com.clms.common.util;

import java.util.regex.Pattern;

public final class ValidationUtil {

    private static final Pattern MAC_ADDRESS = Pattern.compile(
            "^([0-9A-Fa-f]{2}[:\\-]){5}([0-9A-Fa-f]{2})$"
    );

    private static final Pattern IP_ADDRESS = Pattern.compile(
            "^((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$"
    );

    private ValidationUtil() {}

    public static boolean isValidMacAddress(String mac) {
        return mac != null && MAC_ADDRESS.matcher(mac).matches();
    }

    public static boolean isValidIpAddress(String ip) {
        return ip != null && IP_ADDRESS.matcher(ip).matches();
    }
}
