package com.project.dms.domains.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import com.project.dms.domains.enums.Statut_Colis;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@EqualsAndHashCode
@Table(name = "colis")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Colis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Description du colis */
    private String description;

    private Float poids;

    private String expideteurPays;
    private String destinatairePays;


    private String expideteurVille;
    private String destinataireVille;

    private Long expideteurCodePostal;
    private Long destinataireCodePostal;

    private String expideteurAdresse;
    private String destinataireAdresse;

    private String expideteurTelephone;
    private String destinataireTelephone;

    /** Numero de suivi de coli **/
    @Column(unique = true, nullable = false)
    private String numeroSuivi;

    @Enumerated(EnumType.STRING)
    private Statut_Colis statut =  Statut_Colis.EN_ATTENTE;

    private LocalDateTime dateCreation;

//    /** Date de création du colis - générée automatiquement */
//    @Column(name = "date_creation", nullable = false, updatable = false)
//    private Date dateCreation;



    /** Relation avec l'expéditeur (Client) */
    // @ManyToOne
    // @JoinColumn(name = "expediteur_id", nullable = false)
    // private Client expediteur;




    /** Historique des statuts du colis */
    // @OneToMany(mappedBy = "colis", cascade = CascadeType.ALL)
    // private List<HistoriqueStatut> historiqueStatuts;

    /** Relation avec la livraison */
    // @OneToOne(mappedBy = "colis", cascade = CascadeType.ALL)
    // private Livraison livraison;







    // public void setLivreur(Livreur livreur) {}

    // public void setUser(User user) {}

    // Autre option : utiliser @PrePersist pour la date automatique
    // @PrePersist
    // protected void onCreate() {
        // dateCreation = new Date();}
}

