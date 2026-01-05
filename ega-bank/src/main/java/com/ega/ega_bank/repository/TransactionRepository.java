package com.ega.ega_bank.repository;

import com.ega.ega_bank.model.Transaction;
import com.ega.ega_bank.model.TypeTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByCompteId(Long compteId);

    List<Transaction> findByTypeTransaction(TypeTransaction typeTransaction);

    @Query("SELECT t FROM Transaction t WHERE t.compte.id = :compteId " +
           "AND t.dateTransaction BETWEEN :dateDebut AND :dateFin " +
           "ORDER BY t.dateTransaction DESC")
    List<Transaction> findByCompteIdAndDateBetween(Long compteId, LocalDateTime dateDebut, LocalDateTime dateFin);

    @Query("SELECT t FROM Transaction t WHERE t.compte.numeroCompte = :numeroCompte " +
           "ORDER BY t.dateTransaction DESC")
    List<Transaction> findByNumeroCompte(String numeroCompte);

    @Query("SELECT t FROM Transaction t WHERE t.compte.id = :compteId " +
           "ORDER BY t.dateTransaction DESC")
    List<Transaction> findByCompteIdOrderByDateDesc(Long compteId);
}
