package com.project.dms.api.responses;

import com.project.dms.domains.entities.Livreur;
import lombok.Data;

@Data
public class LivreurDisponibleResponse {
    private Long id;
    private String nom;
    private String prenom;
    private String email;
    private String telephone;
    private String adresse;
    private boolean disponibilite;

    public LivreurDisponibleResponse(Livreur livreur) {
        this.id = livreur.getId();
        this.nom = livreur.getNom();
        this.prenom = livreur.getPrenom();
        this.email = livreur.getEmail();
        this.telephone = livreur.getTelephone();
        this.adresse = livreur.getAdresse();
        this.disponibilite = livreur.getDisponibilite();
    }
}