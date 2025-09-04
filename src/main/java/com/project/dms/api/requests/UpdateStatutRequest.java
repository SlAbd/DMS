package com.project.dms.api.requests;

import com.project.dms.domains.enums.Statut_Colis;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class UpdateStatutRequest {
    private Statut_Colis statut;

    // Constructeur par défaut (important pour Jackson)
    public UpdateStatutRequest() {}

    // Constructeur avec paramètre
    @JsonCreator
    public UpdateStatutRequest(@JsonProperty("statut") Statut_Colis statut) {
        this.statut = statut;
    }

    // Getters et Setters
    public Statut_Colis getStatut() {
        return statut;
    }

    public void setStatut(Statut_Colis statut) {
        this.statut = statut;
    }

    // Méthode toString pour le débogage
    @Override
    public String toString() {
        return "UpdateStatutRequest{" +
                "statut=" + statut +
                '}';
    }
}