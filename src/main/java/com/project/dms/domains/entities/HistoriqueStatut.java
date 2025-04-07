package com.project.dms.domains.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Classe représentant l'historique des statuts d'un colis pour un suivi en temps réel.
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = "colis") // Évite les problèmes de récursion infinie
@EqualsAndHashCode(exclude = "colis")
public class HistoriqueStatut {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Statut du colis à un moment donné (ex: "En transit", "Livré", "Annulé") */
    private String statut;

    /** Date et heure du changement de statut */
    private LocalDateTime dateChangement;

    /** Relation avec le colis concerné */
    @ManyToOne
    @JoinColumn(name = "colis_id", nullable = false)
    private Colis colis;
}
