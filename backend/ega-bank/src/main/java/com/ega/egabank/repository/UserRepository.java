package com.ega.egabank.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ega.egabank.entity.User;
import com.ega.egabank.enums.Role;

/**
 * Repository pour la gestion des utilisateurs
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    boolean existsByRole(Role role);

    java.util.List<User> findByEnabled(Boolean enabled);

    java.util.List<User> findByEnabledFalse();

    java.util.List<User> findByEnabledTrue();

    @Query("SELECT u FROM User u WHERE u.client.id = :clientId")
    java.util.Optional<User> findByClientId(@Param("clientId") Long clientId);
}
