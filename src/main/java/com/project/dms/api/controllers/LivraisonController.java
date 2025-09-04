package com.project.dms.api.controllers;

import com.project.dms.api.requests.LivraisonRequest;
import com.project.dms.api.responses.LivraisonLvResponse;
import com.project.dms.api.responses.LivraisonResponse;
import com.project.dms.domains.entities.Livraison;
import com.project.dms.domains.entities.Livreur;
import com.project.dms.services.LivraisonService;
import com.project.dms.api.requests.LivraisonRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/livraisons")
// @CrossOrigin(origins = "*")
public class LivraisonController {

    @Autowired
    private LivraisonService livraisonService;




    @GetMapping
    public ResponseEntity<List<LivraisonResponse>> getAllLivraisons() {
        try {
            List<LivraisonResponse> livraisons = livraisonService.getAllLivraisons();
            return ResponseEntity.ok(livraisons);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<LivraisonResponse> getLivraisonById(@PathVariable Long id) {
        try {
            LivraisonResponse livraison = livraisonService.getLivraisonById(id);
            return ResponseEntity.ok(livraison);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<Livraison> createLivraison(@RequestBody LivraisonRequest request) {
        try {
            Livraison livraison = livraisonService.createLivraison(request);
            return ResponseEntity.ok(livraison);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Livraison> updateLivraison(@PathVariable Long id, @RequestBody LivraisonRequest request) {
        try {
            Livraison updatedLivraison = livraisonService.updateLivraison(id, request);
            return ResponseEntity.ok(updatedLivraison);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLivraison(@PathVariable Long id) {
        livraisonService.deleteLivraison(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/livreur/{livreurId}")
    public ResponseEntity<List<LivraisonResponse>> getLivraisonsByLivreur(@PathVariable Long livreurId) {
        try {
            List<LivraisonResponse> livraisons = livraisonService.getLivraisonsByLivreur(livreurId);
            return ResponseEntity.ok(livraisons);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }



    @GetMapping("/statut/{statut}")
    public ResponseEntity<List<LivraisonResponse>> getLivraisonsByStatut(@PathVariable String statut) {
        try {
            List<LivraisonResponse> livraisons = livraisonService.getLivraisonsByStatut(statut);
            return ResponseEntity.ok(livraisons);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/date/{date}")
    public List<Livraison> getLivraisonsByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return livraisonService.getLivraisonsByDate(date);
    }

    @GetMapping("/livreur/{livreurId}/statut/{statut}")
    public List<Livraison> getLivraisonsByLivreurAndStatut(
            @PathVariable Long livreurId,
            @PathVariable String statut) {
        return livraisonService.getLivraisonsByLivreurAndStatut(livreurId, statut);
    }

    // GET - Récupérer les livraisons du livreur connecté
    @GetMapping("/livreur/mes-livraisons")
    public ResponseEntity<List<LivraisonResponse>> getMesLivraisons(@AuthenticationPrincipal Livreur livreurAuthentifie) {
        try {
            // Récupérer les livraisons du livreur
            List<LivraisonResponse> livraisons = livraisonService.getLivraisonsByLivreur(livreurAuthentifie.getId());

            return ResponseEntity.ok(livraisons);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }


    private LivraisonLvResponse convertToSimpleResponse(Livraison livraison) {
        LivraisonLvResponse response = new LivraisonLvResponse();
        response.setId(livraison.getId());
        response.setDateEstimee(livraison.getDateEstimee());

        if (livraison.getColis() != null) {
            response.setColisId(livraison.getColis().getId());
            response.setColisNumeroSuivi(livraison.getColis().getNumeroSuivi());
        }

        if (livraison.getLivreur() != null) {
            response.setLivreurId(livraison.getLivreur().getId());
        }

        return response;
    }
}