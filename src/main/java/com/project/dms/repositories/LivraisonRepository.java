package com.project.dms.repositories;

import com.project.dms.domains.entities.Livraison;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface LivraisonRepository extends JpaRepository<Livraison, Long> {



    List<Livraison> findByColisStatut(String statut);

    List<Livraison> findByDateEstimee(LocalDate dateEstimee);

    List<Livraison> findByLivreurId(Long livreurId);

    @Query("SELECT l FROM Livraison l WHERE l.livreur.id = :livreurId AND l.colis.statut = :statut")
    List<Livraison> findByLivreurIdAndColisStatut(@Param("livreurId") Long livreurId,
                                                  @Param("statut") String statut);
}