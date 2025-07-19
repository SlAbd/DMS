package com.project.dms.domains.entities;

import com.project.dms.domains.enums.Statut_Colis;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "bordereau_expedition")
public class BordereauExpedition {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String numeroBordereau;

    @Column(nullable = false)
    private LocalDate dateExpedition;

    @Column(nullable = false)
    private String adresseLivraison;

    @Column(nullable = false)
    private Statut_Colis statut; // Ex : "En cours", "Livré", "Annulé"

    
    @Column(nullable = true)
    private String lienPdf; // Lien du bordereau au format PDF

    @ManyToOne
    @JoinColumn(name = "colis_id", nullable = false)
    private Colis colis;

    public BordereauExpedition() {}

    public BordereauExpedition(String numeroBordereau, LocalDate dateExpedition, String adresseLivraison, Statut_Colis statut, Colis colis, String lienPdf) {
        this.numeroBordereau = numeroBordereau;
        this.dateExpedition = dateExpedition;
        this.adresseLivraison = adresseLivraison;
        this.statut = statut;
        this.colis = colis;
        this.lienPdf = lienPdf;

    }

    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNumeroBordereau() { return numeroBordereau; }
    public void setNumeroBordereau(String numeroBordereau) { this.numeroBordereau = numeroBordereau; }

    public LocalDate getDateExpedition() { return dateExpedition; }
    public void setDateExpedition(LocalDate dateExpedition) { this.dateExpedition = dateExpedition; }

    public String getAdresseLivraison() { return adresseLivraison; }
    public void setAdresseLivraison(String adresseLivraison) { this.adresseLivraison = adresseLivraison; }

    public Statut_Colis getStatut() { return statut; }
    public void setStatut(Statut_Colis statut) { this.statut = statut; }

    public Colis getColis() { return colis; }
    public void setColis(Colis colis) { this.colis = colis; }

    public String getLienPdf() { return lienPdf; }
    public void setLienPdf(String lienPdf) { this.lienPdf = lienPdf; }
}
