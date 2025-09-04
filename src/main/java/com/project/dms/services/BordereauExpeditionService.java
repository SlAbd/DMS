package com.project.dms.services;

import com.project.dms.api.exceptions.BordereauNotFoundException;
import com.project.dms.domains.entities.BordereauExpedition;
import com.project.dms.repositories.BordereauExpeditionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BordereauExpeditionService {

    @Autowired
    private BordereauExpeditionRepository bordereauRepository;

    /**
     * Récupérer un bordereau par ID
     */
    public BordereauExpedition getBordereauById(Long id) {
        return bordereauRepository.findById(id)
                .orElseThrow(() -> new BordereauNotFoundException(id));
    }
}