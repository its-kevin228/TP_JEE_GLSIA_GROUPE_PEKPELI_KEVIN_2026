package com.ega.ega_bank.repository;

import com.ega.ega_bank.model.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {

    Optional<Client> findByEmail(String email);

    Optional<Client> findByTelephone(String telephone);

    boolean existsByEmail(String email);

    boolean existsByTelephone(String telephone);

    @Query("SELECT c FROM Client c WHERE LOWER(c.nom) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
           "OR LOWER(c.prenom) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
           "OR LOWER(c.email) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    java.util.List<Client> searchClients(String searchTerm);
}
