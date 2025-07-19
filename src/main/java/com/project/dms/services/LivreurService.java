package com.project.dms.services;


import com.project.dms.api.requests.LivreurRequest;
import com.project.dms.domains.entities.Livreur;
import com.project.dms.repositories.LivreurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LivreurService {

    @Autowired
    private LivreurRepository livreurRepository;

    public List<Livreur> getAllLivreurs() {
        return livreurRepository.findAll();
    }

    public Optional<Livreur> getLivreurById(Long id) {
        return livreurRepository.findById(id);
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

        livreurRepository.save(livreur);
        return livreur;
    }
}