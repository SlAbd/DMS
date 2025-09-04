package com.project.dms.api.responses;

import java.time.LocalDate;

public class LivraisonLvResponse {
    private Long id;
    private LocalDate dateEstimee;
    private Long colisId;
    private String colisNumeroSuivi;
    private Long livreurId;

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDate getDateEstimee() { return dateEstimee; }
    public void setDateEstimee(LocalDate dateEstimee) { this.dateEstimee = dateEstimee; }

    public Long getColisId() { return colisId; }
    public void setColisId(Long colisId) { this.colisId = colisId; }

    public String getColisNumeroSuivi() { return colisNumeroSuivi; }
    public void setColisNumeroSuivi(String colisNumeroSuivi) { this.colisNumeroSuivi = colisNumeroSuivi; }

    public Long getLivreurId() { return livreurId; }
    public void setLivreurId(Long livreurId) { this.livreurId = livreurId; }
}