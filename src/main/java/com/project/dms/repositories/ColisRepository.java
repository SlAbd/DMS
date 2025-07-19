package com.project.dms.repositories;

import com.project.dms.domains.entities.Client;
import com.project.dms.domains.entities.Colis;
import com.project.dms.domains.enums.Statut_Colis;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ColisRepository extends JpaRepository<Colis, Long> {
    List<Colis> findByExpediteur(Client expediteur);
    long countByStatut(Statut_Colis statut);
}
