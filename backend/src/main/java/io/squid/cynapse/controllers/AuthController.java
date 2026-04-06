package io.squid.cynapse.controllers;

import io.squid.cynapse.dto.AuthDTO;
import io.squid.cynapse.entities.User;
import io.squid.cynapse.entities.UserValidationToken;
import io.squid.cynapse.enums.Cookies;
import io.squid.cynapse.repositories.UserRepository;
import io.squid.cynapse.repositories.UserValidationTokenRepository;
import io.squid.cynapse.services.AuthService;
import io.squid.cynapse.services.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

/**
 * @author TopeEstLa
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserValidationTokenRepository userValidationTokenRepository;

    @PostMapping("/sign-up")
    public ResponseEntity<?> signup(@RequestBody  AuthDTO.SignupDTO signupDTO) {
        if (userRepository.findByUsername(signupDTO.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username already exists");
        }

        if (userRepository.findByEmail(signupDTO.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists");
        }

        User user = new User(signupDTO.getUsername(),
                signupDTO.getEmail(),
                this.authService.getPasswordEncoder().encode(signupDTO.getPassword()),
                signupDTO.getLastName(),
                signupDTO.getFirstName(),
                signupDTO.getBirthDate(),
                signupDTO.getGender(),
                signupDTO.getMemberType());

        User savedUser = userRepository.save(user);

        return ResponseEntity.ok(savedUser);
    }

    @PostMapping("/sign-in")
    public ResponseEntity<?> signin(@RequestBody AuthDTO.SigninDTO signinDTO, HttpServletRequest req, HttpServletResponse resp) {
        Optional<User> userOpt = userRepository.findByUsername(signinDTO.getUsername());
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByEmail(signinDTO.getUsername());
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(401).body("Invalid username or email");
            }
        }

        User user = userOpt.get();
        if (!user.isEnable()) {
            return ResponseEntity.status(403).body("Account not enabled. Please check your email for the validation link.");
        }

        if (!this.authService.getPasswordEncoder().matches(signinDTO.getPassword(), user.getPassword())) {
            return ResponseEntity.status(401).body("Invalid password");
        }

        resp.addCookie(Cookies.ACCESS_TOKEN.getCookie(jwtService.buildToken(user.getUsername()), (int) jwtService.getAccessExpirySeconds()));

        return ResponseEntity.ok(user);
    }

    @PostMapping("/validate")
    @PreAuthorize("@authService.hasRequiredRole('ADMIN')")
    public ResponseEntity<?> validateUser(@RequestParam("user_id") long userId) {
        User user = this.userRepository.findById(userId).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        this.authService.validateUser(user);

        return ResponseEntity.ok("Validation email sent");
    }

    @GetMapping("/enable")
    public ResponseEntity<?> enableUser(@RequestParam("token") String token) {
        Optional<UserValidationToken> tokenOpt = this.userValidationTokenRepository.findById(token);
        if (tokenOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid token");
        }

        UserValidationToken validToken = tokenOpt.get();
        User user = validToken.getUser();
        user.setEnable(true);
        this.userRepository.save(user);
        this.userValidationTokenRepository.delete(validToken);

        return ResponseEntity.ok("Account enabled successfully");
    }

}
