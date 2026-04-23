package io.squid.cynapse.entities;

import io.squid.cynapse.enums.MemberType;
import io.squid.cynapse.enums.Role;
import jakarta.persistence.*;

import java.time.LocalDate;

/**
 * @author TopeEstLa
 */
@Entity
public class User {

    //usefull things
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    private String firstName;

    private String lastName;

    private String password;

    private boolean enable;

    @Enumerated(EnumType.ORDINAL)
    private Role role;

    private double exp;

    //useless things
    private String gender;

    private LocalDate birthDate;

    private String image;

    @Enumerated(EnumType.ORDINAL)
    private MemberType memberType;


    public User() {
    }

    public User(String username, String email, String password, String lastName, String firstName, LocalDate birthDate, String gender, MemberType memberType) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.lastName = lastName;
        this.firstName = firstName;
        this.birthDate = birthDate;
        this.gender = gender;
        this.memberType = memberType;

        this.enable = false;
        this.role = Role.USER;
        this.exp = 0;
        this.image = "";
    }

    public User(String username, String email, String lastName, String firstName, String password, boolean enable, Role role, double exp, String gender, LocalDate birthDate, String image, MemberType memberType) {
        this.username = username;
        this.email = email;
        this.lastName = lastName;
        this.firstName = firstName;
        this.password = password;
        this.enable = enable;
        this.role = role;
        this.exp = exp;
        this.gender = gender;
        this.birthDate = birthDate;
        this.image = image;
        this.memberType = memberType;
    }

    public void addExp(double exp) {
        this.exp += exp;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public boolean isEnable() {
        return enable;
    }

    public void setEnable(boolean enable) {
        this.enable = enable;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public double getExp() {
        return exp;
    }

    public void setExp(double exp) {
        this.exp = exp;
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

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public MemberType getMemberType() {
        return memberType;
    }

    public void setMemberType(MemberType memberType) {
        this.memberType = memberType;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", email='" + email + '\'' +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", enable=" + enable +
                ", role=" + role +
                ", exp=" + exp +
                ", gender=" + gender +
                ", birthDate=" + birthDate +
                ", image='" + image + '\'' +
                ", memberType=" + memberType +
                '}';
    }
}
