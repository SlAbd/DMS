package com.project.dms.api.controllers;


import com.project.dms.api.requests.AssignColisRequest;
import com.project.dms.api.responses.ColisResponse;
import com.project.dms.api.responses.ColisStatsResponse;
import com.project.dms.domains.entities.Colis;
import com.project.dms.services.ColisService;
import org.apache.tomcat.util.net.openssl.ciphers.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/colis")
public class ColisController {
    @Autowired
    private ColisService colisService;

    @PostMapping("/ajouterColis")
    public Colis creerColis(@RequestBody Colis colis) { return colisService.creerColis(colis);}

    @GetMapping("/AllColis")
    public List<Colis> getAllColis() { return colisService.getAllColis();}

    @PutMapping
    public Optional<Colis> updateColis(@PathVariable Long id , @RequestBody Colis updatedColis) {
        return colisService.updateColis(id, updatedColis);
    }

    @DeleteMapping
    public boolean deleteColis(@PathVariable Long id){ return colisService.deleteColis(id);}

    @GetMapping("/mes-colis")
    public ResponseEntity<List<ColisResponse>> getMesColis(Authentication authentication) {
        String email = authentication.name(); // Get email from JWT token
        List<ColisResponse> colis = colisService.getColisPourClient(email);
        return ResponseEntity.ok(colis);
    }

    public ColisController(ColisService colisService) {
        this.colisService = colisService;
    }

    @PostMapping("/assign")
    public ResponseEntity<String> assignColisToLivreur(@RequestBody AssignColisRequest request) {
        colisService.assignColisToLivreur(request.colisId(), request.livreurId());
        return ResponseEntity.ok("Colis affecté au livreur avec succès");
    }

    @GetMapping
    public ResponseEntity<ColisStatsResponse> getStatsColis() {
        return ResponseEntity.ok(colisService.getStatistiquesColis());
    }
}
