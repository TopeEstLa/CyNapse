package io.squid.cynapse.services;

import io.squid.cynapse.dto.UserDTO;
import io.squid.cynapse.entities.User;
import io.squid.cynapse.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * @author TopeEstLa
 */
@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public boolean userExists(String username, String email) {
        return this.userRepository.findByUsername(username).isPresent() || this.userRepository.findByEmail(email).isPresent();
    }

    public User findById(long userId) {
        return this.userRepository.findById(userId).orElse(null);
    }

    public User findByUsername(String username) {
        return this.userRepository.findByUsername(username).orElse(null);
    }

    public User findByUsernameOrEmail(String usernameOrEmail) {
        User user = this.userRepository.findByUsername(usernameOrEmail).orElse(null);
        if (user != null) {
            return user;
        }

        return this.userRepository.findByEmail(usernameOrEmail).orElse(null);
    }

    public User save(User user) {
        return this.userRepository.save(user);
    }

    public List<UserDTO.UserProfile> getUsersProfile() {
        List<UserDTO.UserProfile> userProfiles = new ArrayList<>();

        for (User user : this.userRepository.findAll()) {
            userProfiles.add(toUserProfile(user));
        }

        return userProfiles;
    }

    public UserDTO.UserProfile getUserProfile(long userId) {
        User user = this.findById(userId);
        if (user == null) return null;

        return toUserProfile(user);
    }

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof User principal)) {
            return null;
        }

        return this.userRepository.findById(principal.getId()).orElse(null);
    }

    public UserDTO.UserProfile toUserProfile(User user) {
        return new UserDTO.UserProfile(
                user.getId(),
                user.getUsername(),
                user.getMemberType(),
                user.getBirthDate(),
                user.getImage()
        );
    }
}

