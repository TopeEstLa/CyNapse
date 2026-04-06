package io.squid.cynapse.entities;

import jakarta.persistence.*;

/**
 * @author TopeEstLa
 */
@Entity
public class UserValidationToken {

    @Id
    private String token;

    @OneToOne(targetEntity = User.class, fetch = FetchType.EAGER)
    @JoinColumn(nullable = false, name = "user_id")
    private User user;

    public UserValidationToken() {
    }

    public UserValidationToken(String token, User user) {
        this.token = token;
        this.user = user;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getToken() {
        return token;
    }

    public User getUser() {
        return user;
    }
}
