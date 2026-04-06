package io.squid.cynapse.enums;

import jakarta.servlet.http.Cookie;

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


    public Cookie getCookie(String value, int maxAge) {
        Cookie cookie = new Cookie(cookieName, value);
        cookie.setMaxAge(maxAge);
        cookie.setPath("/");
        cookie.setHttpOnly(true);

        return cookie;
    }

    public String getCookieName() {
        return cookieName;
    }
}
