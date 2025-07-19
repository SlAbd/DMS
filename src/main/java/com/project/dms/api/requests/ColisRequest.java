package com.project.dms.api.requests;


import com.project.dms.domains.enums.Statut_Colis;

public record ColisRequest(String description, Statut_Colis statut) {
}
