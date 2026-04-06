package io.squid.cynapse.services;

import io.squid.cynapse.entities.User;
import io.squid.cynapse.enums.Role;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;


/**
 * @author TopeEstLa
 */
@Service("authService")
public class AuthService {

    private final String[] publicEndpoints = {
            "/api/auth/sign-in",
            "/api/auth/sign-out",
            "/api/auth/sign-up",
            //swagger
            "/v3/api-docs",
            "/swagger-ui",
            "/v3/api-docs/**",
            "/swagger-ui/**",
            "/swagger-ui.html"
    };

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public boolean hasRequiredRole(String requiredRole) {
        Role role = Role.valueOf(requiredRole);

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }

        User user = (User) authentication.getPrincipal();
        return user.getRole().getWeight() >= role.getWeight();
    }

    public String[] getPublicEndpoints() {
        return publicEndpoints;
    }

    public BCryptPasswordEncoder getPasswordEncoder() {
        return passwordEncoder;
    }
}
