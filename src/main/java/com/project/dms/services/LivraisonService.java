package com.project.dms.services;

import com.project.dms.api.requests.LivraisonRequest;
import com.project.dms.api.responses.LivraisonResponse;
import com.project.dms.domains.entities.Livraison;
import com.project.dms.domains.entities.Colis;
import com.project.dms.domains.entities.Livreur;
import com.project.dms.repositories.LivraisonRepository;
import com.project.dms.repositories.ColisRepository;
import com.project.dms.repositories.LivreurRepository;
import com.project.dms.api.requests.LivreurRequest;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class LivraisonService {

    @Autowired
    private LivraisonRepository livraisonRepository;

    @Autowired
    private ColisRepository colisRepository;

    @Autowired
    private LivreurRepository livreurRepository;

    // Méthode corrigée pour retourner LivraisonResponse
    public List<LivraisonResponse> getAllLivraisons() {
        List<Livraison> livraisons = livraisonRepository.findAll();

        // Convertir les entités en responses
        return livraisons.stream()
                .map(LivraisonResponse::new)
                .collect(Collectors.toList());
    }

    public LivraisonResponse getLivraisonById(Long id) {
        return livraisonRepository.findById(id)
                .map(LivraisonResponse::new)
                .orElseThrow(() -> new RuntimeException("Livraison non trouvée avec l'ID: " + id));
    }

    public Livraison createLivraison(LivraisonRequest request) {
        // Vérifier que le colis existe
        Colis colis = colisRepository.findById(request.getColisId())
                .orElseThrow(() -> new RuntimeException("Colis non trouvé avec l'ID: " + request.getColisId()));

        // Vérifier que le livreur existe
        Livreur livreur = livreurRepository.findById(request.getLivreurId())
                .orElseThrow(() -> new RuntimeException("Livreur non trouvé avec l'ID: " + request.getLivreurId()));

        // Créer la livraison
        Livraison livraison = new Livraison();
        livraison.setDateEstimee(request.getDateEstimee());
        livraison.setColis(colis);
        livraison.setLivreur(livreur);

        return livraisonRepository.save(livraison);
    }

    public Livraison updateLivraison(Long id, LivraisonRequest request) {
        Optional<Livraison> optionalLivraison = livraisonRepository.findById(id);
        if (optionalLivraison.isPresent()) {
            Livraison livraison = optionalLivraison.get();

            // Mettre à jour les relations si les IDs sont fournis
            if (request.getColisId() != null) {
                Colis colis = colisRepository.findById(request.getColisId())
                        .orElseThrow(() -> new RuntimeException("Colis non trouvé"));
                livraison.setColis(colis);
            }

            if (request.getLivreurId() != null) {
                Livreur livreur = livreurRepository.findById(request.getLivreurId())
                        .orElseThrow(() -> new RuntimeException("Livreur non trouvé"));
                livraison.setLivreur(livreur);
            }

            if (request.getDateEstimee() != null) {
                livraison.setDateEstimee(request.getDateEstimee());
            }

            return livraisonRepository.save(livraison);
        }
        throw new RuntimeException("Livraison non trouvée avec l'ID: " + id);
    }

    public void deleteLivraison(Long id) {
        livraisonRepository.deleteById(id);
    }


    public List<LivraisonResponse> getLivraisonsByStatut(String statut) {
        return livraisonRepository.findByColisStatut(statut).stream()
                .map(LivraisonResponse::new)
                .collect(Collectors.toList());
    }

    public List<Livraison> getLivraisonsByDate(LocalDate date) {
        return livraisonRepository.findByDateEstimee(date);
    }

    public List<Livraison> getLivraisonsByLivreurAndStatut(Long livreurId, String statut) {
        return livraisonRepository.findByLivreurIdAndColisStatut(livreurId, statut);
    }

    public List<LivraisonResponse> getLivraisonsByLivreur(Long livreurId) {
        List<Livraison> livraisons = livraisonRepository.findByLivreurId(livreurId);

        // Initialiser les relations LAZY pour éviter les erreurs de sérialisation
        for (Livraison livraison : livraisons) {
            // Force l'initialisation des relations LAZY
            Hibernate.initialize(livraison.getColis());
            Hibernate.initialize(livraison.getLivreur());
        }

        return livraisons.stream()
                .map(LivraisonResponse::new)
                .collect(Collectors.toList());
    }

}