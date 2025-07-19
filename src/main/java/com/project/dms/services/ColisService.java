package com.project.dms.services;

import com.project.dms.api.responses.ColisResponse;
import com.project.dms.api.responses.ColisStatsResponse;
import com.project.dms.domains.entities.Client;
import com.project.dms.domains.entities.Colis;
import com.project.dms.domains.entities.Livreur;
import com.project.dms.domains.enums.Statut_Colis;
import com.project.dms.repositories.ClientRepository;
import com.project.dms.repositories.ColisRepository;
import com.project.dms.repositories.LivreurRepository;
import lombok.Getter;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;


@Service
@Getter
public class ColisService {

    private final ColisRepository colisRepository;
    private final LivreurRepository livreurRepository;




    /**
     * Obtenir la liste de tous les colis
     */
    public List<Colis> getAllColis() {
        return colisRepository.findAll();
    }

    /**
     * Modifier un colis existant par son ID
     */
    public Optional<Colis> updateColis(Long id, Colis updatedColis) {
        return colisRepository.findById(id).map(colis -> {
            colis.setDescription(updatedColis.getDescription());
            colis.setStatut(updatedColis.getStatut());
            colis.setExpediteur(updatedColis.getExpediteur());
            colis.setLivraison(updatedColis.getLivraison());
            colis.setHistoriqueStatuts(updatedColis.getHistoriqueStatuts());
            return colisRepository.save(colis);
        });
    }

    /**
     * Supprimer un colis par son ID
     */
    public boolean deleteColis(Long id) {
        if (colisRepository.existsById(id)) {
            colisRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public Colis creerColis(Colis nouveauColis) {
        // Générer un numéro de suivi unique
        String numeroSuivi = "COLIS-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        nouveauColis.setNumeroSuivi(numeroSuivi);

        // Initialiser le statut si null
        if (nouveauColis.getStatut() == null) {
            nouveauColis.setStatut(Statut_Colis.EN_ATTENTE);
        }

        return colisRepository.save(nouveauColis);
    }


    public List<ColisResponse> getColisPourClient(String email) {
        ClientRepository clientRepository = null;
        Client client = clientRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Client introuvable"));

        List<Colis> colisList = colisRepository.findByExpediteur( client);

        return colisList.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private ColisResponse mapToResponse(Colis colis) {
        return new ColisResponse.Builder()
                .id(colis.getId())
                .numeroSuivi(colis.getNumeroSuivi())
                .description(colis.getDescription())
                .statut(Statut_Colis.valueOf(String.valueOf(colis.getStatut())))
                .build();
    }

    public ColisService(ColisRepository colisRepository, LivreurRepository livreurRepository) {
        this.colisRepository = colisRepository;
        this.livreurRepository = livreurRepository;
    }

    public void assignColisToLivreur(Long colisId, Long livreurId) {
        Colis colis = colisRepository.findById(colisId)
                .orElseThrow(() -> new RuntimeException("Colis non trouvé"));
        Livreur livreur = livreurRepository.findById(livreurId)
                .orElseThrow(() -> new RuntimeException("Livreur non trouvé"));

        colis.setLivreur(livreur);  // Il faut que la classe Colis ait l'attribut Livreur + setLivreur()
        colisRepository.save(colis);
    }

    public ColisStatsResponse getStatistiquesColis() {
        long enPreparation = colisRepository.countByStatut(Statut_Colis.valueOf("Statut_Colis.EN_PREPARATION"));
        long annule = colisRepository.countByStatut(Statut_Colis.valueOf("Statut_Colis.ANNULE"));
        long livre = colisRepository.countByStatut(Statut_Colis.valueOf("Statut_Colis.LIVRE"));
        long enTransit = colisRepository.countByStatut(Statut_Colis.valueOf("Statut_Colis.EN_TRANSIT"));
        long retour = colisRepository.countByStatut(Statut_Colis.valueOf("Statut_Colis.RETOUR"));

        return new ColisStatsResponse(enPreparation, annule, livre, enTransit, retour);
    }
}

