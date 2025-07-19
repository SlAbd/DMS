package com.project.dms.api.responses;

import com.project.dms.domains.entities.Client;
import com.project.dms.domains.entities.HistoriqueStatut;
import com.project.dms.domains.entities.Livraison;

import com.project.dms.domains.enums.Statut_Colis;

public class ColisResponse {
    private long id;
    private String description;
    private Statut_Colis statut;
    private Client expediteur;
    private HistoriqueStatut[] historiqueStatuts;
    private Livraison livraison;
    private String numeroSuivi ;

    private ColisResponse(Builder builder) {
        this.id = builder.id;
        this.numeroSuivi = builder.numeroSuivi;
        this.description = builder.description;
        this.statut = builder.statut;
    }

    // Builder statique
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String numeroSuivi;
        private String description;
        private Statut_Colis statut;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder numeroSuivi(String numeroSuivi) {
            this.numeroSuivi = numeroSuivi;
            return this;
        }

        public Builder description(String description) {
            this.description = description;
            return this;
        }

        public Builder statut(Statut_Colis statut) {
            this.statut = statut;
            return this;
        }

        public ColisResponse build() {
            return new ColisResponse(this);
        }
    }

}
