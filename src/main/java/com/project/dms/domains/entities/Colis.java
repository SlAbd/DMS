package com.project.dms.domains.entities;

import jakarta.persistence.*;
import lombok.*;
import com.project.dms.domains.enums.Statut_Colis;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@EqualsAndHashCode
@Table(name = "colis")
public class Colis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Description du colis */
    private String description;

    /** Statut actuel du colis */
    /**private String statut;*/

    /** Relation avec l'expéditeur (Client) */
    @ManyToOne
    @JoinColumn(name = "expediteur_id", nullable = false)
    private Client expediteur;




    /** Historique des statuts du colis */
    @OneToMany(mappedBy = "colis", cascade = CascadeType.ALL)
    private List<HistoriqueStatut> historiqueStatuts;

    /** Relation avec la livraison */
    @OneToOne(mappedBy = "colis", cascade = CascadeType.ALL)
    private Livraison livraison;

    /** Numero de suivi de coli **/
    @Column(unique = true, nullable = false)
    private String numeroSuivi;

    @Enumerated(EnumType.STRING)
    private Statut_Colis statut =  Statut_Colis.EN_ATTENTE;


    public void setLivreur(Livreur livreur) {
    }
}
