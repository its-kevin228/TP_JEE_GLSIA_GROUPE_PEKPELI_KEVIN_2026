package com.ega.ega_bank.model;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.*;

import java.math.BigDecimal;

@Entity
@DiscriminatorValue("EPARGNE")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(callSuper = true)
@EqualsAndHashCode(callSuper = true)
public class CompteEpargne extends Compte {

    @Column(name = "taux_interet", precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal tauxInteret = BigDecimal.valueOf(2.5); // Taux par défaut 2.5%

    public void appliquerInterets() {
        BigDecimal interets = getSolde().multiply(tauxInteret).divide(BigDecimal.valueOf(100));
        crediter(interets);
    }
}
