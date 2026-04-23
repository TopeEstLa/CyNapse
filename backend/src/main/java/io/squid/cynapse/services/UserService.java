package io.squid.cynapse.services;

import io.squid.cynapse.dto.UserDTO;
import io.squid.cynapse.entities.User;
import io.squid.cynapse.enums.Role;
import io.squid.cynapse.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * @author TopeEstLa
 */
@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    private final Map<Integer, Role> expToRoleMap = Map.of(150, Role.ADVANCED, 300, Role.EXPERT, 500, Role.ADMIN);

    public boolean userExists(String username, String email) {
        return this.userExistByUsername(username) || this.userExistByUsername(email);
    }

    public boolean userExistByUsername(String username) {
        return this.userRepository.findByUsername(username).isPresent();
    }

    public boolean userExistByEmail(String email) {
        return this.userRepository.findByEmail(email).isPresent();
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

    public void addExpToUser(User user, double exp) {
        user.addExp(exp);
        Role newRole = this.getRoleByExp((int) user.getExp());
        if (newRole.getWeight() > user.getRole().getWeight()) {
            user.setRole(newRole);
        }
        this.save(user);
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

    public List<User> getUsers() {
        List<User> users = new ArrayList<>();

        for (User user : this.userRepository.findAll()) {
            users.add(user);
        } //no brain atm to transform iterable to list with some satanic things

        return users;
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

    public Role getRoleByExp(int exp) {
        Role role = Role.USER;
        for (Map.Entry<Integer, Role> entry : expToRoleMap.entrySet()) {
            if (exp >= entry.getKey()) {
                if (role.getWeight() < entry.getValue().getWeight()) {
                    role = entry.getValue();
                }
            }
        }
        return role;
    }

    public Role getNextRole(User user) {
        double userExp = user.getExp();
        for (Map.Entry<Integer, Role> entry : expToRoleMap.entrySet()) {
            if (userExp < entry.getKey()) {
                return entry.getValue();
            }
        }
        return null;
    }

    public double getExpToNextRole(User user) {
        Role nextRole = getNextRole(user);
        if (nextRole == null) {
            return 0;
        }
        int nextRoleExpThreshold = expToRoleMap.entrySet().stream().filter(entry -> entry.getValue() == nextRole).map(Map.Entry::getKey).findFirst().orElse(Integer.MAX_VALUE);
        return Math.max(0, nextRoleExpThreshold - user.getExp());
    }

    public double getNeededExpForNextRole(User user) {
        Role nextRole = getNextRole(user);
        if (nextRole == null) {
            return 0;
        }
        return expToRoleMap.entrySet().stream().filter(entry -> entry.getValue() == nextRole).map(Map.Entry::getKey).findFirst().orElse(Integer.MAX_VALUE);
    }

    public Map<Integer, Role> getExpToRoleMap() {
        return expToRoleMap;
    }

    public UserDTO.UserProfile toUserProfile(User user) {
        return new UserDTO.UserProfile(user.getId(), user.getUsername(), user.getMemberType(), user.getBirthDate(), user.getImage(), user.getRole(), user.getExp());
    }
}

