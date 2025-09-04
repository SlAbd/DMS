package com.project.dms.api.requests;

import com.fasterxml.jackson.annotation.JsonProperty;

public class DisponibilteRequest {
    private boolean disponibilite;

    // Constructeur par défaut
    public void DisponibiliteRequest() {}

    // Constructeur avec paramètre
    public void DisponibiliteRequest(boolean disponibilite) {
        this.disponibilite = disponibilite;
    }

    // Getter et Setter
    @JsonProperty("disponibilite")
    public boolean isDisponibilite() {
        return disponibilite;
    }

    public void setDisponibilite(boolean disponibilite) {
        this.disponibilite = disponibilite;
    }

    // Méthode toString pour le débogage
    @Override
    public String toString() {
        return "DisponibiliteRequest{" +
                "disponibilite=" + disponibilite +
                '}';
    }
}
