package com.manageit.manageit.task;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.manageit.manageit.project.Project;
import com.manageit.manageit.user.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "tasks")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "task_id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "assigned_project_id", nullable = false)
    private UUID projectId;

    @NotBlank(message = "Task name cannot be empty")
    @Size(max = 255, message = "Task name cannot exceed 255 characters")
    @Column(name = "task_name", nullable = false)
    private String name;

    @NotBlank(message = "Description cannot be empty")
    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private TaskStatus status;

    @Enumerated(EnumType.STRING)
    @Column(name = "priority", nullable = false)
    private TaskPriority priority;

    @Column(nullable = false)
    private LocalDate dueDate;

    @Column(nullable = false, updatable = false, insertable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.LAZY)
    @JoinTable(
            name = "users_tasks",
            joinColumns = @JoinColumn(name = "tasks_task_id"),
            inverseJoinColumns = @JoinColumn(name = "users_user_id")
    )
    private List<User> users;
}
