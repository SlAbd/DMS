package com.project.dms.api.requests;

import com.project.dms.domains.enums.Statut_Colis;

public class ColisRequest {
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
    private Statut_Colis statut;

    // Constructeurs
    public ColisRequest() {}

    // Getters et Setters
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

    public Statut_Colis getStatut() { return statut; }
    public void setStatut(Statut_Colis statut) { this.statut = statut; }
}