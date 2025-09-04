package com.project.dms.api.responses;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.project.dms.domains.entities.Livreur;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class LivreurResponse {
    private Long id;
    private String nom;
    private String prenom;
    private String email;
    private String telephone;
    private String adresse;
    private Boolean disponibilite;

    // Constructeur par défaut (ESSENTIEL pour Jackson)
    public LivreurResponse() {
    }

    // Constructeur avec Livreur
    public LivreurResponse(Livreur livreur) {
        if (livreur != null) {
            this.id = livreur.getId();
            this.nom = livreur.getNom();
            this.prenom = livreur.getPrenom();
            this.email = livreur.getEmail();
            this.telephone = livreur.getTelephone();
            this.adresse = livreur.getAdresse();
            this.disponibilite = livreur.getDisponibilite();
        }
    }

    // Getters et Setters (OBLIGATOIRES pour Jackson)
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getPrenom() { return prenom; }
    public void setPrenom(String prenom) { this.prenom = prenom; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }

    public String getAdresse() { return adresse; }
    public void setAdresse(String adresse) { this.adresse = adresse; }

    public Boolean getDisponibilite() { return disponibilite; }
    public void setDisponibilite(Boolean disponibilite) { this.disponibilite = disponibilite; }
}