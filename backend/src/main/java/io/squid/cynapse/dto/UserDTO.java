package io.squid.cynapse.dto;

import io.squid.cynapse.enums.MemberType;
import io.squid.cynapse.enums.Role;

import java.time.LocalDate;

/**
 * @author TopeEstLa
 */
public class UserDTO {

    public static class UserProfile {

        private long id;
        private String username;
        private MemberType memberType;
        private LocalDate birthDate;
        private String image;
        private String gender;
        private Role role;
        private double exp;

        public UserProfile() {
        }

        public UserProfile(long id, String username, MemberType memberType, LocalDate birthDate, String image, String gender, Role role, double exp) {
            this.id = id;
            this.username = username;
            this.memberType = memberType;
            this.birthDate = birthDate;
            this.image = image;
            this.gender = gender;
            this.role = role;
            this.exp = exp;
        }

        public long getId() {
            return id;
        }

        public String getUsername() {
            return username;
        }

        public MemberType getMemberType() {
            return memberType;
        }

        public LocalDate getBirthDate() {
            return birthDate;
        }

        public String getImage() {
            return image;
        }

        public String getGender() { return gender; }

        public double getExp() {
            return exp;
        }

        public Role getRole() {
            return role;
        }
    }

    public static class UserUpdate {

        private String firstName;
        private String lastName;

        private String gender;
        private LocalDate birthDate;
        private String image;
        private MemberType memberType;

        public UserUpdate() {
        }

        public String getFirstName() {
            return firstName;
        }

        public String getLastName() {
            return lastName;
        }

        public String getGender() {
            return gender;
        }

        public LocalDate getBirthDate() {
            return birthDate;
        }

        public String getImage() {
            return image;
        }

        public MemberType getMemberType() {
            return memberType;
        }
    }

}
