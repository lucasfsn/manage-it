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
    private Integer id;


    @NotBlank(message = "First name cannot be empty")
    @Size(max = 30, min = 2, message = "First name must be between 2 and 30 characters")
    @Pattern(regexp = "^[A-Za-zÀ-ÖØ-öø-ÿ]+$", message = "First name must contain only letters")
    private String firstName;

    @NotBlank(message = "First name cannot be empty")
    @Size(max = 30, min = 2, message = "First name must be between 2 and 30 characters")
    @Pattern(regexp = "^[A-Za-zÀ-ÖØ-öø-ÿ]+$", message = "Last name must contain only letters")
    private String lastName;

    @NotBlank(message = "Password cannot be empty")
    @Size(min = 8, message = "Password must have at least 8 characters")
    private String password;


    @Email(message = "Email should be valid")
    @NotBlank(message = "Email cannot be empty")
    @Column(unique = true)
    private String email;

    @NotBlank(message = "Username cannot be empty")
    @Size(min = 8, max = 30, message = "Username must be between 8 and 30 characters")
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
        return username;
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


