package com.project.dms.api.exceptions;

public class ColisNotFoundException extends RuntimeException {

    public ColisNotFoundException(Long id) {
        super("Colis non trouvé avec l'ID: " + id);
    }

    public ColisNotFoundException(String numeroSuivi) {
        super("Colis non trouvé avec le numéro de suivi: " + numeroSuivi);
    }
}