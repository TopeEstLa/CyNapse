package io.squid.cynapse.controllers.admin;

import io.squid.cynapse.entities.User;
import io.squid.cynapse.services.AuthService;
import io.squid.cynapse.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @author TopeEstLa
 */
@RestController
@RequestMapping("/api/admin/user")
@PreAuthorize("@authService.hasRequiredRole('ADMIN')")
public class AdminUserController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthService authService;


    @GetMapping("/list")
    public ResponseEntity<List<User>> getUsers() {
        return ResponseEntity.ok(this.userService.getUsers());
    }

    @GetMapping("/get")
    public ResponseEntity<?> getUser(long userId) {
        User user = this.userService.findById(userId);
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        return ResponseEntity.ok(user);
    }

    @PostMapping("/update")
    public ResponseEntity<?> updateUser(@RequestBody User user) {
        User currentUser = this.userService.findById(user.getId());
        if (currentUser == null) return ResponseEntity.badRequest().body("User not found");

        if (!currentUser.getUsername().equals(user.getUsername())) {
            if (this.userService.userExistByUsername(user.getUsername())) {
                return ResponseEntity.badRequest().body("Username already taken");
            }
            currentUser.setUsername(user.getUsername());
        }

        if (!currentUser.getEmail().equals(user.getEmail())) {
            if (this.userService.userExistByEmail(user.getEmail())) {
                return ResponseEntity.badRequest().body("Email already taken");
            }
            currentUser.setEmail(user.getEmail());
        } else {
            return ResponseEntity.badRequest().body("Email already taken");
        }

        currentUser.setFirstName(user.getFirstName());
        currentUser.setLastName(user.getLastName());
        currentUser.setEnable(user.isEnable());
        currentUser.setExp(user.getExp());
        currentUser.setGender(user.getGender());
        currentUser.setBirthDate(user.getBirthDate());
        currentUser.setImage(user.getImage());
        currentUser.setMemberType(user.getMemberType());

        return ResponseEntity.ok(this.userService.save(currentUser));
    }

    @PostMapping("/updatePassword")
    public ResponseEntity<?> updatePassword(long userId, String newPassword) {
        User user = this.userService.findById(userId);
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        user.setPassword(this.authService.getPasswordEncoder().encode(newPassword));
        return ResponseEntity.ok(this.userService.save(user));
    }

}
