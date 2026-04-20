package io.squid.cynapse.controllers;

import io.squid.cynapse.dto.UserDTO;
import io.squid.cynapse.entities.User;
import io.squid.cynapse.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

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

}
