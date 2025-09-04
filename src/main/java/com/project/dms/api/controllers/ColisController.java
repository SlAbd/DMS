package com.project.dms.api.controllers;

import com.project.dms.api.exceptions.ColisNotFoundException;
import com.project.dms.api.requests.ColisRequest;
import com.project.dms.api.requests.UpdateStatutRequest;
import com.project.dms.api.responses.ColisResponse;
import com.project.dms.domains.entities.Colis;
import com.project.dms.domains.enums.Statut_Colis;
import com.project.dms.repositories.ColisRepository;
import com.project.dms.services.ColisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/colis")
public class ColisController {

    @Autowired
    private ColisService colisService;

    // GET - Récupérer tous les colis
    @GetMapping
    public ResponseEntity<List<ColisResponse>> getAllColis() {
        List<Colis> colisList = colisService.getAllColis();
        List<ColisResponse> response = colisList.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    // GET - Récupérer un colis par ID
    @GetMapping("/{id}")
    public ResponseEntity<ColisResponse> getColisById(@PathVariable Long id) {
        Colis colis = colisService.getColisById(id);
        ColisResponse response = convertToResponse(colis);
        return ResponseEntity.ok(response);
    }

    // POST - Créer un nouveau colis
    @PostMapping
    public ResponseEntity<ColisResponse> createColis(@RequestBody ColisRequest colisRequest) {
        Colis colis = convertToEntity(colisRequest);
        Colis newColis = colisService.createColis(colis);
        ColisResponse response = convertToResponse(newColis);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // PUT - Mettre à jour un colis existant
    @PutMapping("/{id}")
    public ResponseEntity<ColisResponse> updateColis(@PathVariable Long id, @RequestBody ColisRequest colisRequest) {
        Colis colisDetails = convertToEntity(colisRequest);
        Colis updatedColis = colisService.updateColis(id, colisDetails);
        ColisResponse response = convertToResponse(updatedColis);

        return ResponseEntity.ok(response);
    }

    // DELETE - Supprimer un colis par ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteColis(@PathVariable Long id) {
        colisService.deleteColisById(id);

        return ResponseEntity.ok()
                .body(Map.of(
                        "message", "Colis supprimé avec succès",
                        "id", id,
                        "status", "SUCCESS"
                ));
    }


    /**
     * GET - Récupérer un colis par son numéro de suivi - Version robuste
     */
    @GetMapping("/numero-suivi/{numeroSuivi}")
    public ResponseEntity<?> getColisByNumeroSuivi(@PathVariable String numeroSuivi) {
        try {
            Colis colis = colisService.getColisByNumeroSuivi(numeroSuivi);
            ColisResponse response = convertToResponse(colis);
            return ResponseEntity.ok(response);
        } catch (ColisNotFoundException e) {
            throw e; // Serra géré par GlobalExceptionHandler
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "error", "Requête invalide",
                            "message", e.getMessage(),
                            "numeroSuivi", numeroSuivi
                    ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "error", "Erreur interne",
                            "message", "Erreur lors de la recherche du colis: " + e.getMessage(),
                            "numeroSuivi", numeroSuivi
                    ));
        }
    }

    /**
     * GET - Recherche de colis par numéro de suivi (partiel) - Version robuste
     */
    @GetMapping("/recherche")
    public ResponseEntity<?> searchColisByNumeroSuivi(
            @RequestParam(required = false) String numeroSuivi,
            @RequestParam(required = false) String statut) {

        try {
            List<Colis> colisList;

            if (numeroSuivi != null && statut != null) {
                colisList = colisService.findByNumeroSuiviContainingAndStatut(numeroSuivi, statut);
            } else if (numeroSuivi != null) {
                colisList = colisService.findByNumeroSuiviContaining(numeroSuivi);
            } else if (statut != null) {
                colisList = colisService.findByStatut(statut);
            } else {
                colisList = colisService.getAllColis();
            }

            List<ColisResponse> response = colisList.stream()
                    .map(this::convertToResponse)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "error", "Paramètre invalide",
                            "message", e.getMessage(),
                            "numeroSuivi", numeroSuivi,
                            "statut", statut
                    ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "error", "Erreur interne",
                            "message", "Erreur lors de la recherche: " + e.getMessage(),
                            "numeroSuivi", numeroSuivi,
                            "statut", statut
                    ));
        }
    }

    /**
     * GET - Vérifier si un numéro de suivi existe
     */
    @GetMapping("/{numeroSuivi}/exists")
    public ResponseEntity<Map<String, Object>> checkNumeroSuiviExists(@PathVariable String numeroSuivi) {
        boolean exists = colisService.existsByNumeroSuivi(numeroSuivi);

        return ResponseEntity.ok()
                .body(Map.of(
                        "exists", exists,
                        "numeroSuivi", numeroSuivi,
                        "message", exists ? "Numéro de suivi existe" : "Numéro de suivi non trouvé"
                ));
    }

    /**
     * GET - Récupérer tous les colis par statut
     */
    @GetMapping("/statut/{statut}")
    public ResponseEntity<?> getColisByStatut(@PathVariable String statut) {
        try {
            List<Colis> colisList = colisService.getColisByStatutName(statut);
            List<ColisResponse> response = colisList.stream()
                    .map(this::convertToResponse)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "error", "Statut invalide",
                            "message", e.getMessage(),
                            "statuts_valides", Arrays.toString(Statut_Colis.values())
                    ));
        }
    }

    /**
     * GET - Récupérer tous les colis en attente
     */
    @GetMapping("/en-attente")
    public ResponseEntity<List<ColisResponse>> getColisEnAttente() {
        List<Colis> colisList = colisService.getColisEnAttente();
        List<ColisResponse> response = colisList.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    /**
     * GET - Récupérer tous les colis en cours
     */
    @GetMapping("/en-cours")
    public ResponseEntity<List<ColisResponse>> getColisEnCours() {
        List<Colis> colisList = colisService.getColisEnCours();
        List<ColisResponse> response = colisList.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    /**
     * GET - Récupérer tous les colis livrés
     */
    @GetMapping("/livre")
    public ResponseEntity<List<ColisResponse>> getColisLivre() {
        List<Colis> colisList = colisService.getColisLivre();
        List<ColisResponse> response = colisList.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    /**
     * GET - Récupérer tous les colis annulés
     */
    @GetMapping("/annule")
    public ResponseEntity<List<ColisResponse>> getColisAnnule() {
        List<Colis> colisList = colisService.getColisAnnule();
        List<ColisResponse> response = colisList.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    /**
     * GET - Récupérer tous les colis retournés
     */
    @GetMapping("/retourne")
    public ResponseEntity<List<ColisResponse>> getColisRetourne() {
        List<Colis> colisList = colisService.getColisRetourne();
        List<ColisResponse> response = colisList.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    /**
     * GET - Récupérer les colis par multiple statuts
     */
    @GetMapping("/statuts")
    public ResponseEntity<?> getColisByMultipleStatuts(@RequestParam List<String> statuts) {
        try {
            List<Statut_Colis> statutList = statuts.stream()
                    .map(statut -> Statut_Colis.valueOf(statut.toUpperCase()))
                    .collect(Collectors.toList());

            List<Colis> colisList = colisService.getColisByStatuts(statutList);
            List<ColisResponse> response = colisList.stream()
                    .map(this::convertToResponse)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "error", "Statut invalide",
                            "message", "Un ou plusieurs statuts sont invalides",
                            "statuts_valides", Arrays.toString(Statut_Colis.values()),
                            "statuts_demandes", statuts
                    ));
        }
    }

    /**
     * GET - Statistiques des colis par statut
     */
    @GetMapping("/statistiques")
    public ResponseEntity<Map<String, Object>> getColisStatistics() {
        Map<Statut_Colis, Long> statistics = colisService.getColisStatistics();

        // Convertir l'énumération en String pour la réponse JSON
        Map<String, Long> statsResponse = statistics.entrySet().stream()
                .collect(Collectors.toMap(
                        entry -> entry.getKey().name(),
                        Map.Entry::getValue
                ));

        long total = statistics.values().stream().mapToLong(Long::longValue).sum();

        return ResponseEntity.ok()
                .body(Map.of(
                        "total_colis", total,
                        "par_statut", statsResponse,
                        "statuts", Arrays.stream(Statut_Colis.values())
                                .map(Enum::name)
                                .collect(Collectors.toList())
                ));
    }

    /**
     * GET - Compter le nombre de colis par statut
     */
    @GetMapping("/count/{statut}")
    public ResponseEntity<?> countColisByStatut(@PathVariable String statut) {
        try {
            Statut_Colis statutEnum = Statut_Colis.valueOf(statut.toUpperCase());
            long count = colisService.countColisByStatut(statutEnum);

            return ResponseEntity.ok()
                    .body(Map.of(
                            "statut", statutEnum.name(),
                            "count", count,
                            "message", "Nombre de colis avec le statut " + statutEnum.name()
                    ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "error", "Statut invalide",
                            "message", e.getMessage(),
                            "statuts_valides", Arrays.toString(Statut_Colis.values())
                    ));
        }
    }

    /**
     * PATCH - Modifier le statut d'un colis par ID (sans raison)
     */
    @PutMapping("/{id}/{nouveauStatut}")
    public ResponseEntity<?> updateStatutColisSimple(
            @PathVariable Long id,
            @PathVariable Statut_Colis nouveauStatut) {

        try {
            // Plus besoin de convertir, Spring le fait automatiquement
            Colis colis = colisService.updateStatutColis(id, nouveauStatut);
            ColisResponse response = convertToResponse(colis);

            return ResponseEntity.ok()
                    .body(Map.of(
                            "message", "Statut du colis mis à jour avec succès",
                            "nouveau_statut", nouveauStatut,
                            "colis", response
                    ));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "error", "Statut invalide",
                            "message", e.getMessage(),
                            "statuts_valides", Arrays.toString(Statut_Colis.values())
                    ));
        } catch (ColisNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Erreur interne du serveur"));
        }
    }

    @PutMapping("/{id}/statut")
    public ResponseEntity<?> updateStatutColisWithBody(
            @PathVariable Long id,
            @RequestBody UpdateStatutRequest request) {

        try {
            // Valider que le statut n'est pas null
            if (request.getStatut() == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of(
                                "error", "Statut requis",
                                "message", "Le champ statut est obligatoire"
                        ));
            }

            Colis colis = colisService.updateStatutColis(id, request.getStatut());
            ColisResponse response = convertToResponse(colis);

            return ResponseEntity.ok()
                    .body(Map.of(
                            "message", "Statut du colis mis à jour avec succès",
                            "nouveau_statut", request.getStatut(),
                            "colis", response
                    ));

        } catch (ColisNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "error", "Colis non trouvé",
                            "message", e.getMessage()
                    ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of(
                            "error", "Erreur interne du serveur",
                            "message", e.getMessage()
                    ));
        }
    }

    /**
     * PATCH - Modifier le statut d'un colis par numéro de suivi (sans raison)
     */
    @PutMapping("/numero-suivi/{nouveauStatut}")
    public ResponseEntity<?> updateStatutColisByNumeroSuiviSimple(
            @PathVariable String numeroSuivi,
            @PathVariable Statut_Colis nouveauStatut) {

        try {
            Statut_Colis statut = Statut_Colis.valueOf(String.valueOf(nouveauStatut));
            Colis colis = colisService.updateStatutColisByNumeroSuivi(numeroSuivi, statut);

            ColisResponse response = convertToResponse(colis);

            return ResponseEntity.ok()
                    .body(Map.of(
                            "message", "Statut du colis mis à jour avec succès",
                    "nouveau_statut", statut,
                    "colis", response
                ));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "error", "Statut invalide",
                    "message", e.getMessage(),
                    "statuts_valides", java.util.Arrays.toString(Statut_Colis.values())
                ));
        } catch (ColisNotFoundException e) {
            throw e;
        }
    }

    // Remplacer la méthode convertToResponse existante par :
    private ColisResponse convertToResponse(Colis colis) {
        return new ColisResponse(colis); // Utilise le constructeur qui prend un Colis
    }


//    // Méthodes utilitaires de conversion
//    private ColisResponse convertToResponse(Colis colis) {
//        ColisResponse response = new ColisResponse();
//        response.setId(colis.getId());
//        response.setDescription(colis.getDescription());
//        response.setPoids(colis.getPoids());
//        response.setExpideteurPays(colis.getExpideteurPays());
//        response.setDestinatairePays(colis.getDestinatairePays());
//        response.setExpideteurVille(colis.getExpideteurVille());
//        response.setDestinataireVille(colis.getDestinataireVille());
//        response.setExpideteurCodePostal(colis.getExpideteurCodePostal());
//        response.setDestinataireCodePostal(colis.getDestinataireCodePostal());
//        response.setExpideteurAdresse(colis.getExpideteurAdresse());
//        response.setDestinataireAdresse(colis.getDestinataireAdresse());
//        response.setExpideteurTelephone(colis.getExpideteurTelephone());
//        response.setDestinataireTelephone(colis.getDestinataireTelephone());
//        response.setNumeroSuivi(colis.getNumeroSuivi());
//        response.setStatut(colis.getStatut());
//        response.setDateCreation(colis.getDateCreation());
//
//        return response;
//    }

    private Colis convertToEntity(ColisRequest request) {
        Colis colis = new Colis();
        colis.setDescription(request.getDescription());
        colis.setPoids(request.getPoids());
        colis.setExpideteurPays(request.getExpideteurPays());
        colis.setDestinatairePays(request.getDestinatairePays());
        colis.setExpideteurVille(request.getExpideteurVille());
        colis.setDestinataireVille(request.getDestinataireVille());
        colis.setExpideteurCodePostal(request.getExpideteurCodePostal());
        colis.setDestinataireCodePostal(request.getDestinataireCodePostal());
        colis.setExpideteurAdresse(request.getExpideteurAdresse());
        colis.setDestinataireAdresse(request.getDestinataireAdresse());
        colis.setExpideteurTelephone(request.getExpideteurTelephone());
        colis.setDestinataireTelephone(request.getDestinataireTelephone());
        colis.setStatut(request.getStatut());

        return colis;
    }
}