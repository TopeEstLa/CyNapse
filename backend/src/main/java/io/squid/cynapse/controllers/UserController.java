package io.squid.cynapse.controllers;

import io.squid.cynapse.dto.UserDTO;
import io.squid.cynapse.entities.User;
import io.squid.cynapse.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * @author TopeEstLa
 */
@RestController
@RequestMapping("/api/user")
public class UserController {


    @Autowired
    private UserRepository userRepository;


    @GetMapping("/list")
    public ResponseEntity<List<UserDTO.UserProfile>> getUsersProfile() {
        List<UserDTO.UserProfile> userProfiles = new ArrayList<>();

        for (User user : this.userRepository.findAll()) {
            userProfiles.add(new UserDTO.UserProfile(
                    user.getUsername(),
                    user.getMemberType(),
                    user.getBirthDate(),
                    user.getImage()
            ));
        }

        return ResponseEntity.ok(userProfiles);
    }

    @GetMapping("/get")
    public ResponseEntity<?> getUserProfile(@RequestParam("id") long userId) {
        Optional<User> user = this.userRepository.findById(userId);

        if (user.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        return ResponseEntity.ok(new UserDTO.UserProfile(
                user.get().getUsername(),
                user.get().getMemberType(),
                user.get().getBirthDate(),
                user.get().getImage()
        ));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMyProfile() {
        Authentication  authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();
        if (currentUser == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        Optional<User> user = this.userRepository.findById(currentUser.getId());
        if (user.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }


        User userProfile = user.get();
        userProfile.setPassword("");

        return ResponseEntity.ok(userProfile);
    }

}
