package io.squid.cynapse.dto;

import io.squid.cynapse.enums.MemberType;

import java.time.LocalDate;

/**
 * @author TopeEstLa
 */
public class AuthDTO {

    public static class SignupDTO {
        private String username;
        private String email;
        private String password;

        private String lastName;
        private String firstName;
        private MemberType memberType;
        private String gender;
        private LocalDate birthDate;

        public SignupDTO() {
        }

        public SignupDTO(String username, String email, String password, String lastName, String firstName, MemberType memberType, String gender, LocalDate birthDate) {
            this.username = username;
            this.email = email;
            this.password = password;
            this.lastName = lastName;
            this.firstName = firstName;
            this.memberType = memberType;
            this.gender = gender;
            this.birthDate = birthDate;
        }

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }

        public String getLastName() {
            return lastName;
        }

        public void setLastName(String lastName) {
            this.lastName = lastName;
        }

        public String getFirstName() {
            return firstName;
        }

        public void setFirstName(String firstName) {
            this.firstName = firstName;
        }

        public MemberType getMemberType() {
            return memberType;
        }

        public void setMemberType(MemberType memberType) {
            this.memberType = memberType;
        }

        public String getGender() {
            return gender;
        }

        public void setGender(String gender) {
            this.gender = gender;
        }

        public LocalDate getBirthDate() {
            return birthDate;
        }

        public void setBirthDate(LocalDate birthDate) {
            this.birthDate = birthDate;
        }
    }

    public static class SigninDTO {
        private String username;
        private String password;

        public SigninDTO() {
        }

        public SigninDTO(String username, String password) {
            this.username = username;
            this.password = password;
        }

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }


}
