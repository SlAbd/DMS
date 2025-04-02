package com.project.dms.domains.enums;

public enum Statut_Colis {
    EN_PREPARATION("En préparation"),
    EN_TRANSIT("En transit"),
    LIVRE("Livré"),
    ANNULE("Annulé"),
    EN_RETOUR("En retour");

    private final String libelle;

    Statut_Colis(String libelle) {
        this.libelle = libelle;
    }

    public String getLibelle() {
        return libelle;
    }
}
/*Explication :
EN_PREPARATION : Le colis est en cours de préparation avant l’expédition.

EN_TRANSIT : Le colis est en route vers le destinataire.

LIVRE : Le colis a été livré avec succès.

ANNULE : La commande du colis a été annulée.

EN_RETOUR : Le colis est en retour vers l’expéditeur (par exemple, en cas de non-livraison). */