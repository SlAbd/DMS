package com.project.dms.api.responses;

import com.project.dms.domains.enums.Statut_Colis;

public class ColisStatsResponse {
    private long enPreparation;
    private long annule;
    private long livre;
    private long enTransit;
    private long retour;

    public ColisStatsResponse(long enPreparation, long annule, long livre, long enTransit, long retour) {
        this.enPreparation = enPreparation;
        this.annule = annule;
        this.livre = livre;
        this.enTransit = enTransit;
        this.retour = retour;
    }

    // Getters
}
