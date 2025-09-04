package com.project.dms.services;


import com.project.dms.api.exceptions.LivreurNotFoundException;
import com.project.dms.api.requests.LivreurRequest;
import com.project.dms.api.responses.LivreurDisponibleResponse;
import com.project.dms.domains.entities.Livreur;
import com.project.dms.repositories.LivreurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class LivreurService {

    @Autowired
    private LivreurRepository livreurRepository;
    private PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public List<Livreur> getAllLivreurs() {
        return livreurRepository.findAll();
    }

    public Livreur getLivreurById(Long id) {
        return livreurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Livreur non trouvé avec l'ID: " + id));
    }


    public Livreur saveLivreur(Livreur livreur) {
        return livreurRepository.save(livreur);
    }

    public void deleteLivreur(Long id) {
        livreurRepository.deleteById(id);
    }

    public Livreur creerLivreur(LivreurRequest request) {

        // Vérifier l'unicité de l'email
        livreurRepository.findByEmail(request.email()).ifPresent(l -> {
            throw new IllegalArgumentException("Email déjà utilisé par un autre livreur");
        });

        // Construire et sauver le livreur
        Livreur livreur = new Livreur();
        livreur.setEmail(request.email());
        livreur.setNom(request.nom());
        livreur.setPrenom(request.prenom());
        livreur.setDisponibilite(request.disponibilite());

        // Le mot de passe sera généré automatiquement par @PrePersist
        // ou vous pouvez le setter manuellement si fourni
        if (request.motDePasse() != null) {
            livreur.setMotDePasse(passwordEncoder.encode(request.motDePasse()));
        }
        livreurRepository.save(livreur);
        return livreur;
    }

    // Récupérer tous les livreurs disponibles
    public List<Livreur> getLivreursDisponibles() {
        return livreurRepository.findByDisponibiliteTrue();
    }

    // Compter les livreurs disponibles
    public long countLivreursDisponibles() {
        return livreurRepository.countByDisponibiliteTrue();
    }

    // Dans LivreurService
    public List<LivreurDisponibleResponse> getLivreursDisponiblesResponse() {
        return livreurRepository.findByDisponibiliteTrue().stream()
                .map(LivreurDisponibleResponse::new)
                .collect(Collectors.toList());
    }

    // Récupérer un livreur par son nom exact
    public Optional<Livreur> getLivreurByNom(String nom) {
        return livreurRepository.findByNomIgnoreCase(nom);
    }

    // Rechercher des livreurs par nom (contient)
    public List<Livreur> searchLivreursByNom(String nom) {
        return livreurRepository.findByNomContainingIgnoreCase(nom);
    }

    // Récupérer par nom et prénom exacts
    public Optional<Livreur> getLivreurByNomComplet(String nom, String prenom) {
        return livreurRepository.findByNomIgnoreCaseAndPrenomIgnoreCase(nom, prenom);
    }

    public Livreur updateDisponibilite(Long id, Boolean disponibilite) {
        Livreur livreur = livreurRepository.findById(id)
                .orElseThrow(() -> new LivreurNotFoundException(id));

        livreur.setDisponible(disponibilite);
        return livreurRepository.save(livreur);
    }

    // Vérifier si un livreur est disponible
    public boolean isLivreurDisponible(Long id) {
        Livreur livreur = livreurRepository.findById(id)
                .orElseThrow(() -> new LivreurNotFoundException("Livreur non trouvé avec l'ID: " + id));
        return livreur.isDisponible();
    }
}

