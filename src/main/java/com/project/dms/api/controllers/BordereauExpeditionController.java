package com.project.dms.api.controllers;

import com.project.dms.api.exceptions.BordereauNotFoundException;
import com.project.dms.api.responses.BordereauResponse;
import com.project.dms.domains.entities.BordereauExpedition;
import com.project.dms.services.BordereauExpeditionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/bordereaux")
public class BordereauExpeditionController {

    @Autowired
    private BordereauExpeditionService bordereauService;

    /**
     * GET - Récupérer un bordereau par ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<BordereauResponse> getBordereauById(@PathVariable Long id) {
        BordereauExpedition bordereau = bordereauService.getBordereauById(id);
        BordereauResponse response = convertToResponse(bordereau);
        return ResponseEntity.ok(response);
    }

    /**
     * Méthode utilitaire de conversion
     */
    private BordereauResponse convertToResponse(BordereauExpedition bordereau) {
        BordereauResponse response = new BordereauResponse();
        response.setId(bordereau.getId());
        response.setNumeroBordereau(bordereau.getNumeroBordereau());
        response.setDateExpedition(bordereau.getDateExpedition());
        response.setAdresseLivraison(bordereau.getAdresseLivraison());
        response.setStatut(bordereau.getStatut());
        response.setLienPdf(bordereau.getLienPdf());

        // Informations sur le colis associé
        if (bordereau.getColis() != null) {
            response.setColisId(bordereau.getColis().getId());
            response.setNumeroSuiviColis(bordereau.getColis().getNumeroSuivi());
        }

        return response;
    }
}