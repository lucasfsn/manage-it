package com.manageit.manageit.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {

    @Query("""
        SELECT u FROM User u
        WHERE (:projectId IS NULL OR u.id NOT IN (
            SELECT pm.id FROM Project p
            JOIN p.members pm
            WHERE p.id = :projectId
        ))
        AND LOWER(u.username) LIKE LOWER(CONCAT('%', :pattern, '%'))
    """)
    Optional<List<User>> findByUsernameContainingIgnoreCaseInProject(
            @Param("pattern") String pattern,
            @Param("projectId") UUID projectId
    );

    Optional<List<User>> findByUsernameContainingIgnoreCase(String pattern);
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Optional<User> findById(UUID id);

}
