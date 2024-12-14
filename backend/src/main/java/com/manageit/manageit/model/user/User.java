package com.manageit.manageit.model.user;

import com.manageit.manageit.model.project.Project;
import com.manageit.manageit.role.Role;
import com.manageit.manageit.model.task.Task;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.*;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
//@EntityListeners(EntityListeners.class)
@Table(name = "users")
public class User implements UserDetails, Principal {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "user_id", updatable = false, nullable = false)
    private UUID id;

    @NotBlank(message = "First name cannot be empty")
    @Size(max = 50, min = 2, message = "First name must be between 2 and 50 characters")
    @Pattern(regexp = "^[a-zA-Z\\xC0-\\uFFFF]+([ \\-']{0,1}[a-zA-Z\\xC0-\\uFFFF]+){0,2}[.]{0,1}$", message = "First name must contain only letters")
    private String firstName;

    @NotBlank(message = "First name cannot be empty")
    @Size(max = 50, min = 2, message = "First name must be between 2 and 50 characters")
    @Pattern(regexp = "^[a-zA-Z\\xC0-\\uFFFF]+([ \\-']{0,1}[a-zA-Z\\xC0-\\uFFFF]+){0,2}[.]{0,1}$", message = "Last name must contain only letters")
    private String lastName;

    @NotBlank(message = "Password cannot be empty")
    @Size(min = 8, message = "Password must have at least 8 characters")
    private String password;


    @Email(message = "Email should be valid")
    @NotBlank(message = "Email cannot be empty")
    @Column(unique = true)
    private String email;

    @NotBlank(message = "Username cannot be empty")
    @Size(min = 2, max = 20, message = "Username must be between 2 and 20 characters")
    @Column(unique = true)
    private String username;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;


    @ManyToMany(mappedBy = "members")
    private List<Project> projects;

    @ManyToMany(mappedBy = "users")
    private List<Task> tasks;

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


