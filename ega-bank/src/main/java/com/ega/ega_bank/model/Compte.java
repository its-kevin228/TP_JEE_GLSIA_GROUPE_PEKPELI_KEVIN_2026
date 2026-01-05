package com.ega.ega_bank.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.iban4j.CountryCode;
import org.iban4j.Iban;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "comptes")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "type_compte", discriminatorType = DiscriminatorType.STRING)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"client", "transactions"})
@EqualsAndHashCode(exclude = {"client", "transactions"})
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

    // Génération d'un numéro IBAN aléatoire pour le Togo (TG)
    private String genererNumeroCompte() {
        Iban iban = new Iban.Builder()
                .countryCode(CountryCode.FR) // Utilisons FR car TG n'est pas disponible dans iban4j
                .bankCode("12345")
                .branchCode("67890")
                .accountNumber(String.format("%011d", System.currentTimeMillis() % 100000000000L))
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
