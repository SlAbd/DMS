package com.project.dms.api.exceptions;


public class LivreurNotFoundException extends RuntimeException {

    public LivreurNotFoundException() {
        super("Livreur non trouvé");
    }

    public LivreurNotFoundException(Long id) {
        super("Livreur non trouvé avec l'ID: " + id);
    }

    public LivreurNotFoundException(String message) {
        super(message);
    }

    public LivreurNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}

