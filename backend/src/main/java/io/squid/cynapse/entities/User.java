package io.squid.cynapse.entities;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
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

    private String lastName;

    private String firstName;

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

    public void setId(Long id) {
        this.id = id;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setEnable(boolean enable) {
        this.enable = enable;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public void setExp(double exp) {
        this.exp = exp;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public void setBirthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public void setMemberType(MemberType memberType) {
        this.memberType = memberType;
    }

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public String getLastName() {
        return lastName;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getPassword() {
        return password;
    }

    public boolean isEnable() {
        return enable;
    }

    public Role getRole() {
        return role;
    }

    public double getExp() {
        return exp;
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
