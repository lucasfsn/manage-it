package com.manageit.manageit.repository;

import com.manageit.manageit.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {

    @Query("SELECT u FROM User u WHERE " +
            "(LOWER(u.username) LIKE LOWER(CONCAT('%', :pattern, '%')) OR " +
            "LOWER(u.firstName) LIKE LOWER(CONCAT('%', :pattern, '%')) OR " +
            "LOWER(u.lastName) LIKE LOWER(CONCAT('%', :pattern, '%')) OR " +
            "LOWER(CONCAT(u.firstName, ' ', u.lastName)) LIKE LOWER(CONCAT('%', :pattern, '%'))) AND " +
            "u.id NOT IN (SELECT member.id FROM Project p JOIN p.members member WHERE p.id = :projectId)")
    Optional<List<User>> findByPatternInAllFieldsNotInProject(@Param("pattern") String pattern, @Param("projectId") UUID projectId);


    @Query("SELECT u FROM User u JOIN u.projects p WHERE " +
            "p.id = :projectId AND " +
            "u.id NOT IN (SELECT tu.id FROM Task t JOIN t.users tu WHERE t.id = :taskId) AND " +
            "(LOWER(u.username) LIKE LOWER(CONCAT('%', :pattern, '%')) OR " +
            "LOWER(u.firstName) LIKE LOWER(CONCAT('%', :pattern, '%')) OR " +
            "LOWER(u.lastName) LIKE LOWER(CONCAT('%', :pattern, '%')) OR " +
            "LOWER(CONCAT(u.firstName, ' ', u.lastName)) LIKE LOWER(CONCAT('%', :pattern, '%')))")
    Optional<List<User>> findByPatternInProjectExcludingTask(@Param("pattern") String pattern,
                                                             @Param("projectId") UUID projectId,
                                                             @Param("taskId") UUID taskId);


    @Query("SELECT u FROM User u WHERE " +
            "LOWER(u.username) LIKE LOWER(CONCAT('%', :pattern, '%')) OR " +
            "LOWER(u.firstName) LIKE LOWER(CONCAT('%', :pattern, '%')) OR " +
            "LOWER(u.lastName) LIKE LOWER(CONCAT('%', :pattern, '%')) OR " +
            "LOWER(CONCAT(u.firstName, ' ', u.lastName)) LIKE LOWER(CONCAT('%', :pattern, '%'))")
    Optional<List<User>> findByPatternInAllFields(@Param("pattern") String pattern);
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Optional<User> findById(UUID id);

}
