package com.project.dms.api.responses;

import com.project.dms.domains.enums.Statut_Colis;

public class ColisStatsResponse {

    private Statut_Colis statut;

    public ColisStatsResponse(long enPreparation, long annule, long livre, long enTransit, long retour) {
    }
}
