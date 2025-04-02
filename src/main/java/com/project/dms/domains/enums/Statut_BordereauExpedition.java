package com.project.dms.domains.enums;

public enum Statut_BordereauExpedition {
    EN_COURS("En cours"),
    LIVRE("Livré"),
    ANNULE("Annulé"),
    EN_RETARD("En retard");

    private final String libelle;

    Statut_BordereauExpedition(String libelle) {
        this.libelle = libelle;
    }

    public String getLibelle() {
        return libelle;
    }
}
