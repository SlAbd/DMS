package com.project.dms.repositories;


import com.project.dms.domains.entities.Livreur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LivreurRepository extends JpaRepository<Livreur, Long> {
    Optional<Livreur> findByEmail(String email);

    // Trouver tous les livreurs disponibles
    List<Livreur> findByDisponibiliteTrue();

    // Trouver les livreurs par disponibilité
    List<Livreur> findByDisponibilite(boolean disponibilite);

    // Trouver un livreur par son nom exact (insensible à la casse)
    Optional<Livreur> findByNomIgnoreCase(String nom);

    // Trouver des livreurs dont le nom contient la chaîne (insensible à la casse)
    List<Livreur> findByNomContainingIgnoreCase(String nom);

    // Trouver par nom et prénom exacts
    Optional<Livreur> findByNomIgnoreCaseAndPrenomIgnoreCase(String nom, String prenom);

    // Trouver les livreurs disponibles par ville
    List<Livreur> findByDisponibiliteTrueAndAdresseContainingIgnoreCase(String ville);

    // Compter les livreurs disponibles
    long countByDisponibiliteTrue();

}