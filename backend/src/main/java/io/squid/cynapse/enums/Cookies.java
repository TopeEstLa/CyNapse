package io.squid.cynapse.enums;

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

    public String getCookieName() {
        return cookieName;
    }
}
