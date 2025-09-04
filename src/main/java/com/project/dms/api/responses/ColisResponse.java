package com.project.dms.api.responses;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.project.dms.domains.entities.Colis;
import com.project.dms.domains.enums.Statut_Colis;

import java.time.LocalDateTime;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ColisResponse {
    private Long id;
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
    private String numeroSuivi;
    private Statut_Colis statut;
    private LocalDateTime dateCreation;

    // Constructeur par défaut (ESSENTIEL pour Jackson)
    public ColisResponse() {
    }

    // Constructeur avec Colis
    public ColisResponse(Colis colis) {
        if (colis != null) {
            this.id = colis.getId();
            this.description = colis.getDescription();
            this.poids = colis.getPoids();
            this.expideteurPays = colis.getExpideteurPays();
            this.destinatairePays = colis.getDestinatairePays();
            this.expideteurVille = colis.getExpideteurVille();
            this.destinataireVille = colis.getDestinataireVille();
            this.expideteurCodePostal = colis.getExpideteurCodePostal();
            this.destinataireCodePostal = colis.getDestinataireCodePostal();
            this.expideteurAdresse = colis.getExpideteurAdresse();
            this.destinataireAdresse = colis.getDestinataireAdresse();
            this.expideteurTelephone = colis.getExpideteurTelephone();
            this.destinataireTelephone = colis.getDestinataireTelephone();
            this.numeroSuivi = colis.getNumeroSuivi();
            this.statut = colis.getStatut();
            this.dateCreation = colis.getDateCreation();
        }
    }

    // Getters et Setters (OBLIGATOIRES pour Jackson)
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Float getPoids() { return poids; }
    public void setPoids(Float poids) { this.poids = poids; }

    public String getExpideteurPays() { return expideteurPays; }
    public void setExpideteurPays(String expideteurPays) { this.expideteurPays = expideteurPays; }

    public String getDestinatairePays() { return destinatairePays; }
    public void setDestinatairePays(String destinatairePays) { this.destinatairePays = destinatairePays; }

    public String getExpideteurVille() { return expideteurVille; }
    public void setExpideteurVille(String expideteurVille) { this.expideteurVille = expideteurVille; }

    public String getDestinataireVille() { return destinataireVille; }
    public void setDestinataireVille(String destinataireVille) { this.destinataireVille = destinataireVille; }

    public Long getExpideteurCodePostal() { return expideteurCodePostal; }
    public void setExpideteurCodePostal(Long expideteurCodePostal) { this.expideteurCodePostal = expideteurCodePostal; }

    public Long getDestinataireCodePostal() { return destinataireCodePostal; }
    public void setDestinataireCodePostal(Long destinataireCodePostal) { this.destinataireCodePostal = destinataireCodePostal; }

    public String getExpideteurAdresse() { return expideteurAdresse; }
    public void setExpideteurAdresse(String expideteurAdresse) { this.expideteurAdresse = expideteurAdresse; }

    public String getDestinataireAdresse() { return destinataireAdresse; }
    public void setDestinataireAdresse(String destinataireAdresse) { this.destinataireAdresse = destinataireAdresse; }

    public String getExpideteurTelephone() { return expideteurTelephone; }
    public void setExpideteurTelephone(String expideteurTelephone) { this.expideteurTelephone = expideteurTelephone; }

    public String getDestinataireTelephone() { return destinataireTelephone; }
    public void setDestinataireTelephone(String destinataireTelephone) { this.destinataireTelephone = destinataireTelephone; }

    public String getNumeroSuivi() { return numeroSuivi; }
    public void setNumeroSuivi(String numeroSuivi) { this.numeroSuivi = numeroSuivi; }

    public Statut_Colis getStatut() { return statut; }
    public void setStatut(Statut_Colis statut) { this.statut = statut; }

    public LocalDateTime getDateCreation() { return dateCreation; }
    public void setDateCreation(LocalDateTime dateCreation) { this.dateCreation = dateCreation; }
}