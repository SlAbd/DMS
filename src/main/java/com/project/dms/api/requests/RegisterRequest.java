package com.project.dms.api.requests;

import com.project.dms.domains.enums.Role;

public record RegisterRequest(
        String nom,
        String email,
        String motDePasse,
        Role role) {
}
