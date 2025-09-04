package com.project.dms.api.responses;

import com.project.dms.domains.enums.Statut_Colis;
import java.time.LocalDate;

public class BordereauResponse {
    private Long id;
    private String numeroBordereau;
    private LocalDate dateExpedition;
    private String adresseLivraison;
    private Statut_Colis statut;
    private String lienPdf;
    private Long colisId;
    private String numeroSuiviColis;

    // Constructeurs
    public BordereauResponse() {}

    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNumeroBordereau() { return numeroBordereau; }
    public void setNumeroBordereau(String numeroBordereau) { this.numeroBordereau = numeroBordereau; }

    public LocalDate getDateExpedition() { return dateExpedition; }
    public void setDateExpedition(LocalDate dateExpedition) { this.dateExpedition = dateExpedition; }

    public String getAdresseLivraison() { return adresseLivraison; }
    public void setAdresseLivraison(String adresseLivraison) { this.adresseLivraison = adresseLivraison; }

    public Statut_Colis getStatut() { return statut; }
    public void setStatut(Statut_Colis statut) { this.statut = statut; }

    public String getLienPdf() { return lienPdf; }
    public void setLienPdf(String lienPdf) { this.lienPdf = lienPdf; }

    public Long getColisId() { return colisId; }
    public void setColisId(Long colisId) { this.colisId = colisId; }

    public String getNumeroSuiviColis() { return numeroSuiviColis; }
    public void setNumeroSuiviColis(String numeroSuiviColis) { this.numeroSuiviColis = numeroSuiviColis; }
}