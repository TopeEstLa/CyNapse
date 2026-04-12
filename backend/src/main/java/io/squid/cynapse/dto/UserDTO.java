package io.squid.cynapse.dto;

import io.squid.cynapse.enums.MemberType;

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

        public UserProfile() {
        }

        public UserProfile(long id, String username, MemberType memberType, LocalDate birthDate, String image) {
            this.id = id;
            this.username = username;
            this.memberType = memberType;
            this.birthDate = birthDate;
            this.image = image;
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
    }

}
