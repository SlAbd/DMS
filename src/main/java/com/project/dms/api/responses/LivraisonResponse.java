package com.project.dms.api.responses;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.project.dms.domains.entities.Livraison;

import java.time.LocalDate;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class LivraisonResponse {
    private Long id;
    private LocalDate dateEstimee;
    private ColisResponse colis;
    private LivreurResponse livreur;

    // Constructeur par défaut (ESSENTIEL pour Jackson)
    public LivraisonResponse() {
    }

    // Constructeur avec Livraison
    public LivraisonResponse(Livraison livraison) {
        if (livraison != null) {
            this.id = livraison.getId();
            this.dateEstimee = livraison.getDateEstimee();

            if (livraison.getColis() != null) {
                this.colis = new ColisResponse(livraison.getColis());
            }

            if (livraison.getLivreur() != null) {
                this.livreur = new LivreurResponse(livraison.getLivreur());
            }
        }
    }

    // Getters et Setters (OBLIGATOIRES pour Jackson)
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDate getDateEstimee() { return dateEstimee; }
    public void setDateEstimee(LocalDate dateEstimee) { this.dateEstimee = dateEstimee; }

    public ColisResponse getColis() { return colis; }
    public void setColis(ColisResponse colis) { this.colis = colis; }

    public LivreurResponse getLivreur() { return livreur; }
    public void setLivreur(LivreurResponse livreur) { this.livreur = livreur; }
}