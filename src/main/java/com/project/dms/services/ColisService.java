package com.project.dms.services;

import com.project.dms.api.exceptions.ColisNotFoundException;
import com.project.dms.domains.entities.Colis;
import com.project.dms.domains.enums.Statut_Colis;
import com.project.dms.repositories.ColisRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ColisService {

    @Autowired
    private ColisRepository colisRepository;

    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    // GET - Récupérer tous les colis
    public List<Colis> getAllColis() {
        return colisRepository.findAll();
    }

    // GET - Récupérer un colis par ID
    public Colis getColisById(Long id) {
        return colisRepository.findById(id)
                .orElseThrow(() -> new ColisNotFoundException(id));
    }



    // POST - Créer un nouveau colis
    public Colis createColis(Colis colis) {
        // Générer un numéro de suivi unique
        String numeroSuivi = generateNumeroSuiviUnique();
        colis.setNumeroSuivi(numeroSuivi);

        // Définir le statut par défaut
        if (colis.getStatut() == null) {
            colis.setStatut(Statut_Colis.EN_ATTENTE);
        }

        // Définir la date de création
        if (colis.getDateCreation() == null) {
            colis.setDateCreation(LocalDateTime.now());
        }

        return colisRepository.save(colis);
    }

    // PUT - Mettre à jour un colis existant
    public Colis updateColis(Long id, Colis colisDetails) {
        Colis colis = getColisById(id);

        // Mettre à jour les champs
        if (colisDetails.getDescription() != null) {
            colis.setDescription(colisDetails.getDescription());
        }
        if (colisDetails.getPoids() != null) {
            colis.setPoids(colisDetails.getPoids());
        }
        if (colisDetails.getExpideteurPays() != null) {
            colis.setExpideteurPays(colisDetails.getExpideteurPays());
        }
        if (colisDetails.getDestinatairePays() != null) {
            colis.setDestinatairePays(colisDetails.getDestinatairePays());
        }
        if (colisDetails.getExpideteurVille() != null) {
            colis.setExpideteurVille(colisDetails.getExpideteurVille());
        }
        if (colisDetails.getDestinataireVille() != null) {
            colis.setDestinataireVille(colisDetails.getDestinataireVille());
        }
        if (colisDetails.getExpideteurCodePostal() != null) {
            colis.setExpideteurCodePostal(colisDetails.getExpideteurCodePostal());
        }
        if (colisDetails.getDestinataireCodePostal() != null) {
            colis.setDestinataireCodePostal(colisDetails.getDestinataireCodePostal());
        }
        if (colisDetails.getExpideteurAdresse() != null) {
            colis.setExpideteurAdresse(colisDetails.getExpideteurAdresse());
        }
        if (colisDetails.getDestinataireAdresse() != null) {
            colis.setDestinataireAdresse(colisDetails.getDestinataireAdresse());
        }
        if (colisDetails.getExpideteurTelephone() != null) {
            colis.setExpideteurTelephone(colisDetails.getExpideteurTelephone());
        }
        if (colisDetails.getDestinataireTelephone() != null) {
            colis.setDestinataireTelephone(colisDetails.getDestinataireTelephone());
        }
        if (colisDetails.getStatut() != null) {
            colis.setStatut(colisDetails.getStatut());
        }

        return colisRepository.save(colis);
    }

    // DELETE - Supprimer un colis par ID
    public void deleteColisById(Long id) {
        try {
            // Vérifier si le colis existe avant de le supprimer
            if (!colisRepository.existsById(id)) {
                throw new ColisNotFoundException(id);
            }

            colisRepository.deleteById(id);

        } catch (EmptyResultDataAccessException e) {
            throw new ColisNotFoundException(id);
        }
    }



    /**
     * Vérifier si un numéro de suivi existe
     */
    public boolean existsByNumeroSuivi(String numeroSuivi) {
        return colisRepository.existsByNumeroSuivi(numeroSuivi);
    }

    // Méthodes utilitaires
    public boolean colisExistsById(Long id) {
        return colisRepository.existsById(id);
    }

    public long getColisCount() {
        return colisRepository.count();
    }

    // Générer un numéro de suivi unique
    private String generateNumeroSuiviUnique() {
        String numeroSuivi;
        int tentatives = 0;

        do {
            if (tentatives > 10) {
                throw new RuntimeException("Impossible de générer un numéro de suivi unique après 10 tentatives");
            }

            // Format: TIMESTAMP + 4 caractères aléatoires
            String timestamp = String.valueOf(System.currentTimeMillis() % 10000);
            String randomPart = generateRandomString(4);
            numeroSuivi = timestamp + randomPart;

            tentatives++;
        } while (colisRepository.existsByNumeroSuivi(numeroSuivi));

        return numeroSuivi;
    }

    private String generateRandomString(int length) {
        Random random = new Random();
        StringBuilder sb = new StringBuilder(length);

        for (int i = 0; i < length; i++) {
            int index = random.nextInt(CHARACTERS.length());
            sb.append(CHARACTERS.charAt(index));
        }

        return sb.toString();
    }



    /**
     * Récupérer un colis par son numéro de suivi - Version robuste
     */
    public Colis getColisByNumeroSuivi(String numeroSuivi) {
        if (numeroSuivi == null || numeroSuivi.trim().isEmpty()) {
            throw new IllegalArgumentException("Le numéro de suivi ne peut pas être vide");
        }

        return colisRepository.findByNumeroSuivi(numeroSuivi.trim())
                .orElseThrow(() -> new ColisNotFoundException(numeroSuivi));
    }



    /**
     * Recherche de colis par numéro de suivi partiel - Version robuste
     */
    public List<Colis> findByNumeroSuiviContaining(String numeroSuivi) {
        if (numeroSuivi == null || numeroSuivi.trim().isEmpty()) {
            return colisRepository.findAll();
        }
        return colisRepository.findByNumeroSuiviContainingIgnoreCase(numeroSuivi.trim());
    }

    /**
     * Recherche de colis par statut - Version robuste
     */
    public List<Colis> findByStatut(String statutStr) {
        if (statutStr == null || statutStr.trim().isEmpty()) {
            return colisRepository.findAll();
        }

        try {
            Statut_Colis statut = Statut_Colis.valueOf(statutStr.trim().toUpperCase());
            return colisRepository.findByStatut(statut);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Statut invalide: " + statutStr + ". Statuts valides: " +
                    java.util.Arrays.toString(Statut_Colis.values()));
        }
    }

    /**
     * Recherche de colis par numéro de suivi partiel et statut - Version robuste
     */
    public List<Colis> findByNumeroSuiviContainingAndStatut(String numeroSuivi, String statutStr) {
        String numeroSuiviClean = (numeroSuivi != null) ? numeroSuivi.trim() : "";
        String statutStrClean = (statutStr != null) ? statutStr.trim() : "";

        if (numeroSuiviClean.isEmpty() && statutStrClean.isEmpty()) {
            return colisRepository.findAll();
        }

        try {
            Statut_Colis statut = statutStrClean.isEmpty() ? null : Statut_Colis.valueOf(statutStrClean.toUpperCase());

            if (numeroSuiviClean.isEmpty()) {
                return colisRepository.findByStatut(statut);
            } else if (statut == null) {
                return colisRepository.findByNumeroSuiviContainingIgnoreCase(numeroSuiviClean);
            } else {
                return colisRepository.findByNumeroSuiviContainingIgnoreCaseAndStatut(numeroSuiviClean, statut);
            }
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Statut invalide: " + statutStr + ". Statuts valides: " +
                    java.util.Arrays.toString(Statut_Colis.values()));
        }
    }


    /**
     * Récupérer tous les colis par statut
     */
    public List<Colis> getColisByStatut(Statut_Colis statut) {
        return colisRepository.findByStatut(statut);
    }

    /**
     * Récupérer les colis par multiple statuts
     */
    public List<Colis> getColisByStatuts(List<Statut_Colis> statuts) {
        return colisRepository.findByStatutIn(statuts);
    }

    /**
     * Récupérer les colis par nom de statut (String)
     */
    public List<Colis> getColisByStatutName(String statutName) {
        try {
            Statut_Colis statut = Statut_Colis.valueOf(statutName.toUpperCase());
            return colisRepository.findByStatut(statut);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Statut invalide: " + statutName +
                    ". Statuts valides: " + Arrays.toString(Statut_Colis.values()));
        }
    }

    /**
     * Récupérer tous les colis en attente
     */
    public List<Colis> getColisEnAttente() {
        return colisRepository.findByStatut(Statut_Colis.EN_ATTENTE);
    }

    /**
     * Récupérer tous les colis en cours
     */
    public List<Colis> getColisEnCours() {
        return colisRepository.findByStatut(Statut_Colis.EN_COURS);
    }

    /**
     * Récupérer tous les colis livrés
     */
    public List<Colis> getColisLivre() {
        return colisRepository.findByStatut(Statut_Colis.LIVRE);
    }

    /**
     * Récupérer tous les colis annulés
     */
    public List<Colis> getColisAnnule() {
        return colisRepository.findByStatut(Statut_Colis.ANNULE);
    }

    /**
     * Récupérer tous les colis retournés
     */
    public List<Colis> getColisRetourne() {
        return colisRepository.findByStatut(Statut_Colis.EN_RETOUR);
    }

    /**
     * Compter le nombre de colis par statut
     */
    public long countColisByStatut(Statut_Colis statut) {
        return colisRepository.countByStatut(statut);
    }

    /**
     * Obtenir les statistiques de tous les statuts
     */
    public Map<Statut_Colis, Long> getColisStatistics() {
        List<Object[]> results = colisRepository.countColisByStatut();
        return results.stream()
                .collect(Collectors.toMap(
                        result -> (Statut_Colis) result[0],
                        result -> (Long) result[1]
                ));
    }

    /**
     * Modifier le statut d'un colis par son ID (sans raison)
     */
    public Colis updateStatutColis(Long id, Statut_Colis nouveauStatut) {
        // Récupérer le colis existant
        Colis colis = colisRepository.findById(id)
                .orElseThrow(() -> new ColisNotFoundException("Colis non trouvé avec l'ID: " + id));

        // Mettre à jour le statut
        colis.setStatut(nouveauStatut);

        // Sauvegarder les modifications
        return colisRepository.save(colis);
    }

    /**
     * Modifier le statut d'un colis par son numéro de suivi (sans raison)
     */
    public Colis updateStatutColisByNumeroSuivi(String numeroSuivi, Statut_Colis nouveauStatut) {
        return updateStatutColisByNumeroSuivi(numeroSuivi, nouveauStatut);
    }

    /**
     * Validation des transitions de statut
     */
    private void validateStatutTransition(Statut_Colis ancienStatut, Statut_Colis nouveauStatut) {
        // Règles de validation (ajuster selon vos besoins)
        if (ancienStatut == Statut_Colis.LIVRE && nouveauStatut == Statut_Colis.EN_ATTENTE) {
            throw new IllegalArgumentException("Impossible de repasser un colis livré en statut 'EN_ATTENTE'");
        }

        if (ancienStatut == Statut_Colis.ANNULE && nouveauStatut != Statut_Colis.ANNULE) {
            throw new IllegalArgumentException("Impossible de modifier le statut d'un colis annulé");
        }

        if (ancienStatut == Statut_Colis.LIVRE && nouveauStatut == Statut_Colis.ANNULE) {
            throw new IllegalArgumentException("Impossible d'annuler un colis déjà livré");
        }
    }

//    public List<Colis> getColisByLivreurId(Long livreurId) {
//        return
//    }
}