package io.squid.cynapse.controllers;

import io.squid.cynapse.dto.AuthDTO;
import io.squid.cynapse.entities.User;
import io.squid.cynapse.enums.Cookies;
import io.squid.cynapse.services.AuthService;
import io.squid.cynapse.services.JwtService;
import io.squid.cynapse.services.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * @author TopeEstLa
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/sign-up")
    public ResponseEntity<?> signup(@RequestBody AuthDTO.SignupDTO signupDTO) {
        if (this.userService.userExists(signupDTO.getUsername(), signupDTO.getEmail())) {
            return ResponseEntity.badRequest().body("username or email already exists");
        }

        User user = new User(signupDTO.getUsername(),
                signupDTO.getEmail(),
                this.authService.getPasswordEncoder().encode(signupDTO.getPassword()),
                signupDTO.getLastName(),
                signupDTO.getFirstName(),
                signupDTO.getBirthDate(),
                signupDTO.getGender(),
                signupDTO.getMemberType());

        this.userService.save(user);

        return ResponseEntity.ok("User registered successfully. Please wait an administrator to authorize your sign-up");
    }

    @PostMapping("/sign-in")
    public ResponseEntity<?> signin(@RequestBody AuthDTO.SigninDTO signinDTO, HttpServletRequest req, HttpServletResponse resp) {
        User user = this.userService.findByUsernameOrEmail(signinDTO.getUsername());
        if (user == null) {
            return ResponseEntity.status(401).body("Invalid username or email");
        }

        if (!user.isEnable()) {
            return ResponseEntity.status(403).body("Account not enabled. Please check your email for the validation link.");
        }

        if (!this.authService.getPasswordEncoder().matches(signinDTO.getPassword(), user.getPassword())) {
            return ResponseEntity.status(401).body("Invalid password");
        }

        ResponseCookie cookie = Cookies.ACCESS_TOKEN.getCookie(jwtService.buildToken(user.getUsername()), (int) jwtService.getAccessExpirySeconds());
        resp.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return ResponseEntity.ok(user);
    }

    @PostMapping("/sign-out")
    public ResponseEntity<?> signout(HttpServletResponse resp) {
        ResponseCookie cookie = Cookies.ACCESS_TOKEN.getCookie("", 0);
        resp.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        return ResponseEntity.ok("Logged out successfully");
    }

    @PostMapping("/updatePassword")
    public ResponseEntity<?> updatePassword(@RequestBody AuthDTO.UpdatePasswordDTO updatePasswordDTO) {
        User user = this.userService.getCurrentUser();
        if (user == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        if (!this.authService.getPasswordEncoder().matches(updatePasswordDTO.getCurrentPassword(), user.getPassword())) {
            return ResponseEntity.status(401).body("Invalid current password");
        }

        user.setPassword(this.authService.getPasswordEncoder().encode(updatePasswordDTO.getNewPassword()));
        this.userService.save(user);

        return ResponseEntity.ok("Password updated successfully");
    }

    @PostMapping("/authorize")
    @PreAuthorize("@authService.hasRequiredRole('ADMIN')")
    public ResponseEntity<?> authorizeUser(@RequestParam("user_id") long userId) {
        User user = this.userService.findById(userId);
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        if (!this.authService.authorizeUser(user)) {
            return ResponseEntity.status(500).body("Failed to send validation email");
        }

        return ResponseEntity.ok("Validation email sent");
    }

    @GetMapping("/enable")
    public ResponseEntity<?> enableUser(@RequestParam("token") String token) {
        if (!this.authService.validationTokenExist(token)) {
            return ResponseEntity.badRequest().body("Invalid or expired validation token");
        }

        if (!this.authService.enableUser(token)) {
            return ResponseEntity.status(500).body("Failed to enable account");
        }

        return ResponseEntity.ok("Account enabled successfully");
    }

}
