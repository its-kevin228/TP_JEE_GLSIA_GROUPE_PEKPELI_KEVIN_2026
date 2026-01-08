package com.ega.ega_bank.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.iban4j.CountryCode;
import org.iban4j.Iban;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorColumn;
import jakarta.persistence.DiscriminatorType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "comptes")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "type_compte", discriminatorType = DiscriminatorType.STRING)
@Data
@NoArgsConstructor
@AllArgsConstructor
public abstract class Compte {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "numero_compte", nullable = false, unique = true, length = 34)
    private String numeroCompte;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private TypeCompte type;

    @Column(name = "date_creation", nullable = false, updatable = false)
    private LocalDateTime dateCreation;

    @NotNull(message = "Le solde ne peut pas être null")
    @DecimalMin(value = "0.0", message = "Le solde ne peut pas être négatif")
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal solde = BigDecimal.ZERO;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    @OneToMany(mappedBy = "compte", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Transaction> transactions = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        this.dateCreation = LocalDateTime.now();
        this.solde = BigDecimal.ZERO;
        if (this.numeroCompte == null) {
            this.numeroCompte = genererNumeroCompte();
        }
    }

    // Génération d'un numéro IBAN (utilise Allemagne car Côte d'Ivoire non supporté par iban4j)
    private String genererNumeroCompte() {
        Iban iban = new Iban.Builder()
                .countryCode(CountryCode.DE) // Allemagne
                .bankCode("12345678")
                .accountNumber(String.format("%010d", System.currentTimeMillis() % 10000000000L))
                .build();
        return iban.toString();
    }

    // Méthodes métier
    public void crediter(BigDecimal montant) {
        if (montant.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Le montant doit être positif");
        }
        this.solde = this.solde.add(montant);
    }

    public void debiter(BigDecimal montant) {
        if (montant.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Le montant doit être positif");
        }
        if (this.solde.compareTo(montant) < 0) {
            throw new IllegalStateException("Solde insuffisant");
        }
        this.solde = this.solde.subtract(montant);
    }
}
