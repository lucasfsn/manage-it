package com.manageit.manageit.feature.project.model;

import com.manageit.manageit.feature.task.model.Task;
import com.manageit.manageit.feature.user.model.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "projects")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "project_id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @NotBlank(message = "Project name cannot be empty.")
    @Size(min = 5, max = 100, message = "Project name must be between 5 and 100 characters.")
    @Column(name = "project_name", nullable = false)
    private String name;

    @NotBlank(message = "Description cannot be empty.")
    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @JdbcType(PostgreSQLEnumJdbcType.class)
    private ProjectStatus status ;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(nullable = false)
    private LocalDate startDate;

    @Column(nullable = false)
    private LocalDate endDate;


    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "project_members",
            joinColumns = @JoinColumn(name = "projects_project_id"),
            inverseJoinColumns = @JoinColumn(name = "users_user_id")
    )
    private List<User> members;

    @OneToMany(
            mappedBy = "project",
            cascade = CascadeType.REMOVE,
            fetch = FetchType.LAZY
    )
    private List<Task> tasks;
}
