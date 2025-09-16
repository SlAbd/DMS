package com.project.dms.api.controllers;


import com.project.dms.api.exceptions.LivreurNotFoundException;
import com.project.dms.api.requests.LivreurRequest;
import com.project.dms.api.responses.LivreurResponse;
import com.project.dms.domains.entities.Livreur;
import com.project.dms.repositories.LivreurRepository;
import com.project.dms.services.LivreurService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/livreur")
public class LivreurController {

    @Autowired
    private LivreurService livreurService;


    @GetMapping("/livreurs")
    public List<Livreur> getAllLivreurs() {
        return livreurService.getAllLivreurs();
    }

    @GetMapping("/livreurs-disponible")
    public List<Livreur> getAllLivreursDisponible() {
        return livreurService.getAllDisponible() ;
    }
    @GetMapping("/livreurs-non-disponible")
    public List<Livreur> getAllLivreursNonDisponible() {
        return livreurService.getAllNonDisponible()
    }

    @GetMapping("/{id}")
    public Optional<Livreur> getLivreurById(@PathVariable Long id) {
        return Optional.ofNullable(livreurService.getLivreurById(id));
    }

    @PostMapping
    public Livreur saveLivreur(@RequestBody Livreur livreur) {
        return livreurService.saveLivreur(livreur);
    }

    @DeleteMapping("/{id}")
    public void deleteLivreur(@PathVariable Long id) {
        livreurService.deleteLivreur(id);
    }

    @PostMapping("/creer")
    public ResponseEntity<?> createLivreur(@RequestBody LivreurRequest request) {
        try {
            Livreur livreur = livreurService.creerLivreur(request);
            return ResponseEntity.ok(livreur);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // GET - Récupérer tous les livreurs disponibles
    @GetMapping("/disponibles")
    public ResponseEntity<List<Livreur>> getLivreursDisponibles() {
        try {
            List<Livreur> livreurs = livreurService.getLivreursDisponibles();
            return ResponseEntity.ok(livreurs);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // GET - Compter les livreurs disponibles
    @GetMapping("/disponibles/count")
    public ResponseEntity<Long> countLivreursDisponibles() {
        try {
            long count = livreurService.countLivreursDisponibles();
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // GET - Récupérer le profil du livreur connecté
    @GetMapping("/mon-profil")
    public ResponseEntity<LivreurResponse> getMonProfil(@AuthenticationPrincipal Livreur livreurAuthentifie) {
        try {
            // Récupérer le livreur complet depuis la base de données
            Livreur livreur = livreurService.getLivreurById(livreurAuthentifie.getId());

            // Convertir en LivreurResponse
            LivreurResponse response = new LivreurResponse(livreur);

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // GET - Récupérer un livreur par son nom exact
    @GetMapping("/nom/{nom}")
    public ResponseEntity<Livreur> getLivreurParNom(@PathVariable String nom) {
        Optional<Livreur> livreur = livreurService.getLivreurByNom(nom);
        return livreur.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET - Rechercher des livreurs par nom (contient)
    @GetMapping("/rechercher")
    public ResponseEntity<List<Livreur>> rechercherLivreursParNom(
            @RequestParam String nom) {

        List<Livreur> livreurs = livreurService.searchLivreursByNom(nom);
        return ResponseEntity.ok(livreurs);
    }

    // GET - Récupérer par nom et prénom exacts
    @GetMapping("/nom/{nom}/prenom/{prenom}")
    public ResponseEntity<Livreur> getLivreurParNomComplet(
            @PathVariable String nom,
            @PathVariable String prenom) {

        Optional<Livreur> livreur = livreurService.getLivreurByNomComplet(nom, prenom);
        return livreur.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/profil")
    public ResponseEntity<LivreurResponse> getLivreurProfil(@PathVariable Long id) {
        try {
            Livreur livreur = livreurService.getLivreurById(id);
            LivreurResponse response = new LivreurResponse(livreur);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

//    @GetMapping("/{livreurId}/colis")
//    public ResponseEntity<List<Colis>> getColisByLivreur(@PathVariable Long livreurId) {
//        ColisService colisService= new ColisService();
//        try {
//            List<Colis> colis = colisService.getColisByLivreurId(livreurId);
//            return ResponseEntity.ok(colis);
//        } catch (Exception e) {
//            return ResponseEntity.notFound().build();
//        }
//    }

    // Vérifier la disponibilité d'un livreur spécifique
    @GetMapping("/{id}/disponible")
    public ResponseEntity<?> isLivreurDisponible(@PathVariable Long id) {
        try {
            boolean estDisponible = livreurService.isLivreurDisponible(id);
            return ResponseEntity.ok()
                    .body(Map.of(
                            "disponible", estDisponible,
                            "message", estDisponible ? "Livreur disponible" : "Livreur indisponible"
                    ));
        } catch (LivreurNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "error", "Livreur non trouvé",
                            "message", e.getMessage()
                    ));
        }
    }


    @PutMapping("/{id}/disponibilite")
    public ResponseEntity<?> updateDisponibilite(
            @PathVariable Long id,
            @RequestBody Map<String, Object> request) {

        try {
            // Recherche insensible à la casse et aux accents
            Object disponibiliteObj = findDisponibiliteValue(request);

            if (disponibiliteObj == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of(
                                "error", "Champ manquant",
                                "message", "Le champ 'disponibilite' est requis",
                                "champsReçus", request.keySet(), // Montre les champs reçus
                                "timestamp", LocalDateTime.now()
                        ));
            }

            Boolean disponibilite = convertToBoolean(disponibiliteObj);

            if (disponibilite == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of(
                                "error", "Valeur invalide",
                                "message", "Le champ 'disponibilite' doit être true/false, 1/0, 'true'/'false'",
                                "valeurRecue", disponibiliteObj.toString(),
                                "timestamp", LocalDateTime.now()
                        ));
            }

            Livreur livreur = livreurService.updateDisponibilite(id, disponibilite);

            return ResponseEntity.ok()
                    .body(Map.of(
                            "message", "Disponibilité mise à jour avec succès",
                            "livreurId", livreur.getId(),
                            "disponibilite", livreur.isDisponible(),
                            "nom", livreur.getNom()
                    ));

        } catch (LivreurNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "error", "Livreur non trouvé",
                            "message", e.getMessage(),
                            "livreurId", id,
                            "timestamp", LocalDateTime.now()
                    ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "error", "Erreur interne",
                            "message", "Une erreur s'est produite lors de la mise à jour",
                            "livreurId", id,
                            "timestamp", LocalDateTime.now()
                    ));
        }
    }

    // Méthode pour trouver la valeur de disponibilite (insensible à la casse et accents)
    private Object findDisponibiliteValue(Map<String, Object> request) {
        // Chercher les variations possibles
        String[] possibleKeys = {
                "disponibilite", "disponibilité", "Disponibilite", "Disponibilité",
                "disponibilite ", " disponibilite", "disponibilitee", "disponibilite"
        };

        for (String key : possibleKeys) {
            if (request.containsKey(key)) {
                return request.get(key);
            }
        }

        // Chercher de manière insensible à la casse
        for (String key : request.keySet()) {
            if (key.trim().equalsIgnoreCase("disponibilite") ||
                    key.trim().equalsIgnoreCase("disponibilité")) {
                return request.get(key);
            }
        }

        return null;
    }

    // Méthode de conversion (inchangée)
    private Boolean convertToBoolean(Object value) {
        if (value instanceof Boolean) return (Boolean) value;

        if (value instanceof String) {
            String strValue = ((String) value).toLowerCase().trim();
            if (strValue.equals("true") || strValue.equals("1") ||
                    strValue.equals("oui") || strValue.equals("yes")) return true;
            if (strValue.equals("false") || strValue.equals("0") ||
                    strValue.equals("non") || strValue.equals("no")) return false;
        }

        if (value instanceof Number) {
            return ((Number) value).intValue() == 1;
        }

        return null;
    }

    // Endpoint pour l'authentification des livreurs avec identifiantLivreur
    //@PostMapping("/login")
    /*ublic ResponseEntity<?> loginLivreur(@RequestBody Map<String, String> credentials) {
        try {
            String identifiantLivreur = credentials.get("identifiantLivreur");
            String email = credentials.get("email");

            if (identifiantLivreur == null || email == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Identifiant et mot de passe requis"));
            }

            // Rechercher le livreur par son identifiant en utilisant le service
            Optional<Livreur> livreurOpt = livreurService.getLivreurByIdentifiantLivreur(identifiantLivreur);

            if (livreurOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Identifiant ou mot de passe incorrect"));
            }

            Livreur livreur = livreurOpt.get();

            // Vérifier le mot de passe en utilisant le service
            /*if (!livreurService.verifierMotDePasse(livreur, email)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Identifiant ou mot de passe incorrect"));
            }*/

            // Créer une réponse avec les informations du livreur
         /*LivreurResponse response = new LivreurResponse(livreur);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erreur lors de l'authentification", 
                                 "message", e.getMessage()));
        }
    }*/

    @PostMapping("/verifier-email")
    public ResponseEntity<?> verifierEmail(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");

        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Email requis"));
        }

        Optional<Livreur> livreurOpt = livreurService.getLivreurByEmail(email);
        if (livreurOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Email introuvable"));
        }

        // Optionnel : ne renvoyer que des infos minimales
        return ResponseEntity.ok(Map.of(
                "message", "Email valide",
                "identifiantLivreur", livreurOpt.get().getIdentifiantLivreur()
        ));
    }

    @PostMapping("/verifier-identifiant")
    public ResponseEntity<?> verifierIdentifiant(@RequestBody Map<String, String> payload) {
        String identifiant = payload.get("identifiantLivreur");

        if (identifiant == null || identifiant.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Identifiant requis"));
        }

        Optional<Livreur> livreurOpt = livreurService.getLivreurByIdentifiantLivreur(identifiant);

        if (livreurOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Identifiant incorrect"));
        }

        Livreur livreur = livreurOpt.get();
        return ResponseEntity.ok(new LivreurResponse(livreur));
    }



}
