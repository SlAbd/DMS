package com.project.dms.api.exceptions;

public class BordereauNotFoundException extends RuntimeException {

    public BordereauNotFoundException(Long id) {
        super("Bordereau non trouvé avec l'ID: " + id);
    }

    public BordereauNotFoundException(String numeroBordereau) {
        super("Bordereau non trouvé avec le numéro: " + numeroBordereau);
    }
}