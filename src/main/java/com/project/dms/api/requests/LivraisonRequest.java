package com.project.dms.api.requests;

import lombok.Data;
import java.time.LocalDate;

@Data
public class LivraisonRequest {
    private LocalDate dateEstimee;
    private Long colisId;
    private Long livreurId;
}