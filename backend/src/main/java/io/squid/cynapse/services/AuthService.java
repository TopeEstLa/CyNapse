package io.squid.cynapse.services;

import io.squid.cynapse.entities.User;
import io.squid.cynapse.entities.UserValidationToken;
import io.squid.cynapse.enums.Role;
import io.squid.cynapse.repositories.UserValidationTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;


/**
 * @author TopeEstLa
 */
@Service("authService")
public class AuthService {

    private final String[] publicEndpoints = {
            "/api/auth/sign-in",
            "/api/auth/sign-out",
            "/api/auth/sign-up",
            "/api/auth/enable",
            //swagger
            "/v3/api-docs",
            "/swagger-ui",
            "/v3/api-docs/**",
            "/swagger-ui/**",
            "/swagger-ui.html"
    };

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Autowired
    private UserValidationTokenRepository userValidationTokenRepository;

    @Autowired
    private MailService mailService;

    @Autowired
    private UserService userService;

    public boolean hasRequiredRole(String requiredRole) {
        Role role = Role.valueOf(requiredRole);

        User user = userService.getCurrentUser();

        if (user == null) return false;

        return user.getRole().getWeight() >= role.getWeight();
    }

    public boolean authorizeUser(User user) {
        UUID token = UUID.randomUUID();

        UserValidationToken validToken = new UserValidationToken(token.toString(), user);
        String validationLink = "http://localhost:8080/api/auth/enable?token=" + token;

        try {
            this.mailService.sendPlainText(user.getEmail(), "Cynapse Account Validation", "Please click the following link to validate your account: " + validationLink);
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }

        this.userValidationTokenRepository.save(validToken);
        return true;
    }

    public boolean enableUser(String validationToken) {
        UserValidationToken userValidationToken = this.userValidationTokenRepository.findById(validationToken).orElse(null);
        if (userValidationToken == null) return false;


        User user = userValidationToken.getUser();
        user.setEnable(true);
        this.userService.save(user);
        this.userValidationTokenRepository.delete(userValidationToken);
        return true;
    }

    public boolean validationTokenExist(String token) {
        return this.userValidationTokenRepository.existsById(token);
    }

    public String[] getPublicEndpoints() {
        return publicEndpoints;
    }

    public BCryptPasswordEncoder getPasswordEncoder() {
        return passwordEncoder;
    }
}
