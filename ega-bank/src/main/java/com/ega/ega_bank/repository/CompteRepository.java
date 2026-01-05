package com.ega.ega_bank.repository;

import com.ega.ega_bank.model.Compte;
import com.ega.ega_bank.model.TypeCompte;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CompteRepository extends JpaRepository<Compte, Long> {

    Optional<Compte> findByNumeroCompte(String numeroCompte);

    List<Compte> findByClientId(Long clientId);

    List<Compte> findByType(TypeCompte type);

    boolean existsByNumeroCompte(String numeroCompte);

    @Query("SELECT c FROM Compte c WHERE c.client.id = :clientId AND c.type = :type")
    List<Compte> findByClientIdAndType(Long clientId, TypeCompte type);

    @Query("SELECT COUNT(c) FROM Compte c WHERE c.client.id = :clientId")
    long countByClientId(Long clientId);
}
