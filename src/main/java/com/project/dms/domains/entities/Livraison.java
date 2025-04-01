package com.project.dms.domains.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

/**
 * Classe représentant une livraison associée à un colis et un livreur.
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = "colis") // Évite les problèmes de récursion infinie
@EqualsAndHashCode(exclude = "colis")
public class Livraison {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Date estimée de livraison */
    private LocalDate dateEstimee;

    /** Relation avec le colis */
    @OneToOne
    @JoinColumn(name = "colis_id", nullable = false)
    private Colis colis;

    /** Relation avec le livreur */
    @ManyToOne
    @JoinColumn(name = "livreur_id", nullable = false)
    private Livreur livreur;
}
