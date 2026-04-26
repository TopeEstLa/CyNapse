package io.squid.cynapse.enums;

import org.springframework.http.ResponseCookie;

/**
 * @author TopeEstLa
 */
public enum Cookies {

    ACCESS_TOKEN("access_token"),
    REFRESH_TOKEN("refresh_token");

    private final String cookieName;

    Cookies(String cookieName) {
        this.cookieName = cookieName;
    }


    public ResponseCookie getCookie(String value, int maxAge) {
        return ResponseCookie.from(cookieName, value)
                .maxAge(maxAge)
                .path("/")
                .httpOnly(true)
                .secure(true)
                .sameSite("None")
                .build();
    }

    public String getCookieName() {
        return cookieName;
    }
}
