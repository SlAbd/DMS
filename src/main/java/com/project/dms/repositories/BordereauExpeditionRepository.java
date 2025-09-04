package com.project.dms.repositories;

import com.project.dms.domains.entities.BordereauExpedition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BordereauExpeditionRepository extends JpaRepository<BordereauExpedition, Long> {

    // Trouver un bordereau par son numéro (optionnel)
    Optional<BordereauExpedition> findByNumeroBordereau(String numeroBordereau);
}