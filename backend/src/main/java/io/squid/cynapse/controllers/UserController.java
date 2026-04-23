package io.squid.cynapse.controllers;

import io.squid.cynapse.annotation.AddUserExp;
import io.squid.cynapse.dto.UserDTO;
import io.squid.cynapse.entities.User;
import io.squid.cynapse.enums.Role;
import io.squid.cynapse.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @author TopeEstLa
 */
@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/list")
    public ResponseEntity<List<UserDTO.UserProfile>> getUsersProfile() {
        return ResponseEntity.ok(this.userService.getUsersProfile());
    }

    @GetMapping("/get")
    @AddUserExp(exp = 20)
    public ResponseEntity<?> getUserProfile(@RequestParam("id") long userId) {
        UserDTO.UserProfile userProfile = this.userService.getUserProfile(userId);
        if (userProfile == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        return ResponseEntity.ok(userProfile);
    }

    @GetMapping("/me")
    public ResponseEntity<?> getUser() {
        User user = this.userService.getCurrentUser();
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        return ResponseEntity.ok(user);
    }

    @PostMapping("/updateProfile")
    public ResponseEntity<?> updateProfile(@RequestBody UserDTO.UserUpdate updateProfileDTO) {
        User user = this.userService.getCurrentUser();
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        user.setFirstName(updateProfileDTO.getFirstName());
        user.setLastName(updateProfileDTO.getLastName());

        user.setGender(updateProfileDTO.getGender());
        user.setBirthDate(updateProfileDTO.getBirthDate());
        user.setImage(updateProfileDTO.getImage());
        user.setMemberType(updateProfileDTO.getMemberType());

        return ResponseEntity.ok(this.userService.save(user));
    }

    @GetMapping("/nextRole")
    public ResponseEntity<?> getNextRole() {
        User user = this.userService.getCurrentUser();
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        Role nextRole = this.userService.getNextRole(user);
        if (nextRole == null) {
            return ResponseEntity.ok(Role.ADMIN);
        }

        return ResponseEntity.ok(nextRole);
    }

    @GetMapping("/expToNextRole")
    public ResponseEntity<?> getExpToNextRole() {
        User user = this.userService.getCurrentUser();
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        double expToNextRole = this.userService.getExpToNextRole(user);
        return ResponseEntity.ok(expToNextRole);
    }

    @GetMapping("/neededExpForNextRole")
    public ResponseEntity<?> getNeededExpForNextRole() {
        User user = this.userService.getCurrentUser();
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        Role nextRole = this.userService.getNextRole(user);
        if (nextRole == null) {
            return ResponseEntity.ok("Already at highest role");
        }

        double nextRoleExpThreshold = this.userService.getNeededExpForNextRole(user);

        return ResponseEntity.ok(nextRoleExpThreshold);
    }

    @GetMapping("/expToRoleMapping")
    public ResponseEntity<?> getExpToRoleMapping() {
        return ResponseEntity.ok(this.userService.getExpToRoleMap());
    }
}
