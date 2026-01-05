package com.ega.ega_bank.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = "compte")
@EqualsAndHashCode(exclude = "compte")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "type_transaction", nullable = false)
    private TypeTransaction typeTransaction;

    @NotNull(message = "Le montant est obligatoire")
    @DecimalMin(value = "0.01", message = "Le montant doit être supérieur à 0")
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal montant;

    @Column(name = "date_transaction", nullable = false)
    private LocalDateTime dateTransaction;

    @Size(max = 255, message = "La description ne peut pas dépasser 255 caractères")
    @Column(length = 255)
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "compte_id", nullable = false)
    private Compte compte;

    // Pour les virements : compte destinataire
    @Column(name = "compte_destinataire")
    private String compteDestinataire;

    @PrePersist
    protected void onCreate() {
        this.dateTransaction = LocalDateTime.now();
    }
}
