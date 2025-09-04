package com.project.dms.repositories;

import com.project.dms.domains.entities.Colis;
import com.project.dms.domains.enums.Statut_Colis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ColisRepository extends JpaRepository<Colis, Long> {
    // Vérifier si un colis existe par ID
    boolean existsById(Long id);

    // Trouver un colis par son numéro de suivi
    Optional<Colis> findByNumeroSuivi(String numeroSuivi);

    // Vérifier si un numéro de suivi existe déjà
    boolean existsByNumeroSuivi(String numeroSuivi);

    // Trouver les colis dont le numéro de suivi contient une chaîne
    List<Colis> findByNumeroSuiviContainingIgnoreCase(String numeroSuivi);

    // Trouver les colis par statut
    List<Colis> findByStatut(Statut_Colis statut);

    // Trouver les colis par numéro de suivi (partiel) et statut
    List<Colis> findByNumeroSuiviContainingIgnoreCaseAndStatut(String numeroSuivi, Statut_Colis statut);

    // Trouver les colis par multiple statuts
    List<Colis> findByStatutIn(List<Statut_Colis> statuts);

    // Compter le nombre de colis par statut
    long countByStatut(Statut_Colis statut);

    // Trouver les colis par statut avec pagination
    @Query("SELECT c FROM Colis c WHERE c.statut = :statut ORDER BY c.dateCreation DESC")
    List<Colis> findByStatutOrderByDateCreationDesc(@Param("statut") Statut_Colis statut);

    // Statistiques avancées
    @Query("SELECT c.statut, COUNT(c) FROM Colis c GROUP BY c.statut")
    List<Object[]> countColisByStatut();

    // Recherche avancée avec requête personnalisée (version corrigée)
    @Query("SELECT c FROM Colis c WHERE " +
            "LOWER(c.numeroSuivi) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(c.description) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(c.destinataireVille) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Colis> searchColis(@Param("query") String query);

    // Compter le nombre total de colis
    long count();
}
























// public interface ColisRepository extends JpaRepository<Colis, Long> {
// List<Colis> findByExpediteur(Client expediteur);
//    long countByStatut(Statut_Colis statut);
//    Colis findByNumeroSuivi(String numeroSuivi);

//    // Méthode pour compter tous les colis
//    long count();
//}



