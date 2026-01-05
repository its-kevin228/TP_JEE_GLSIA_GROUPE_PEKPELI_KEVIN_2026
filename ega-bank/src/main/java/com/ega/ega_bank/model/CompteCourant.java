package com.ega.ega_bank.model;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.*;

import java.math.BigDecimal;

@Entity
@DiscriminatorValue("COURANT")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(callSuper = true)
@EqualsAndHashCode(callSuper = true)
public class CompteCourant extends Compte {

    @Column(name = "decouvert_autorise", precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal decouvertAutorise = BigDecimal.ZERO;

    @Override
    public void debiter(BigDecimal montant) {
        if (montant.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Le montant doit être positif");
        }
        BigDecimal soldeFutur = getSolde().subtract(montant);
        if (soldeFutur.compareTo(decouvertAutorise.negate()) < 0) {
            throw new IllegalStateException("Découvert autorisé dépassé");
        }
        setSolde(soldeFutur);
    }
}
