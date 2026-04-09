package io.squid.cynapse.dto;

import io.squid.cynapse.enums.MemberType;

import java.time.LocalDate;

/**
 * @author TopeEstLa
 */
public class UserDTO {

    public static class UserProfile {

        private String username;
        private int age;
        private MemberType memberType;
        private LocalDate birthDate;
        private String image;

        public UserProfile() {
        }

        public UserProfile(String username, int age, MemberType memberType, LocalDate birthDate, String image) {
            this.username = username;
            this.age = age;
            this.memberType = memberType;
            this.birthDate = birthDate;
            this.image = image;
        }

        public String getUsername() {
            return username;
        }

        public int getAge() {
            return age;
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
    }

}
