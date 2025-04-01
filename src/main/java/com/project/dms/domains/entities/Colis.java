package com.project.dms.domains.entities;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

/**
 * Classe représentant un colis expédié avec son statut, son expéditeur, son destinataire et son livreur.
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@EqualsAndHashCode
public class Colis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Description du colis */
    private String description;

    /** Statut actuel du colis */
    private String statut;

    /** Relation avec l'expéditeur (Client) */
    @ManyToOne
    @JoinColumn(name = "expediteur_id", nullable = false)
    private Client expediteur;

    /** Relation avec le destinataire (Client) */
    @ManyToOne
    @JoinColumn(name = "destinataire_id", nullable = false)
    private Client destinataire;


    /** Historique des statuts du colis */
    @OneToMany(mappedBy = "colis", cascade = CascadeType.ALL)
    private List<HistoriqueStatut> historiqueStatuts;

    /** Relation avec la livraison */
    @OneToOne(mappedBy = "colis", cascade = CascadeType.ALL)
    private Livraison livraison;
}
