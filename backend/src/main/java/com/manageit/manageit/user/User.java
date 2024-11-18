package com.manageit.manageit.user;

import com.manageit.manageit.role.Role;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.UUID;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@EntityListeners(EntityListeners.class)
@Table(name = "users")
public class User implements UserDetails, Principal {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private UUID id;


    @NotBlank(message = "First name cannot be empty")
    @Size(max = 50, min = 2, message = "First name must be between 2 and 50 characters")
    @Pattern(regexp = "^[A-Za-zÀ-ÖØ-öø-ÿ]+$", message = "First name must contain only letters")
    private String firstName;

    @NotBlank(message = "First name cannot be empty")
    @Size(max = 50, min = 2, message = "First name must be between 2 and 50 characters")
    @Pattern(regexp = "^[A-Za-zÀ-ÖØ-öø-ÿ]+$", message = "Last name must contain only letters")
    private String lastName;

    @NotBlank(message = "Password cannot be empty")
    @Size(min = 8, message = "Password must have at least 8 characters")
//    @Pattern(
//            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$",
//            message = "USER Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character (!@#$%^&*)."
//    )
    private String password;


    @Email(message = "Email should be valid")
    @NotBlank(message = "Email cannot be empty")
    @Column(unique = true)
    private String email;

    @NotBlank(message = "Username cannot be empty")
    @Size(min = 2, max = 20, message = "Username must be between 2 and 20 characters")
//    @Pattern(
//            regexp = "^(?=(?:[^A-Za-z]*[A-Za-z]){2})(?![^\\d~`?!^*¨ˆ;@=$%{}\\[\\]|\\\\/<#“.,]*[\\d~`?!^*¨ˆ;@=$%{}\\[\\]|\\\\/<#“.,])\\S+(?: \\S+){0,2}$",
//            message = "Username must contain at least two letters, cannot include certain special characters, and must not start or end with spaces."
//    )
    @Column(unique = true)
    private String username;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(Role.USER.name()));
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return UserDetails.super.isAccountNonExpired(); //true
    }

    @Override
    public boolean isAccountNonLocked() {
        return UserDetails.super.isAccountNonLocked(); //true
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return UserDetails.super.isCredentialsNonExpired(); //true
    }

    @Override
    public boolean isEnabled() {
        return UserDetails.super.isEnabled(); //true
    }

    @Override
    public String getName() {
        return username;
    }
}


