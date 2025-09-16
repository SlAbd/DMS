package com.project.dms.domains.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Random;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@EqualsAndHashCode(callSuper = true)
@DiscriminatorValue("LIVREUR")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Livreur extends User {
    private String adresse;
    private String prenom;
    private String telephone;
    // private String vehicule;
    private boolean disponibilite;
    private String identifiantLivreur; // Identifiant unique pour l'authentification

    public Boolean getDisponibilite() {
        return disponibilite;
    }



    public void setDisponible(boolean disponibilite) { this.disponibilite = disponibilite; }

    private String generateRandomPassword() {
        String upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        String lowerCase = "abcdefghijklmnopqrstuvwxyz";
        String numbers = "0123456789";
        String specialChars = "!@#$%^&*";
        String allChars = upperCase + lowerCase + numbers + specialChars;

        Random random = new Random();
        StringBuilder password = new StringBuilder();

        // Assurer au moins un caractère de chaque type
        password.append(upperCase.charAt(random.nextInt(upperCase.length())));
        password.append(lowerCase.charAt(random.nextInt(lowerCase.length())));
        password.append(numbers.charAt(random.nextInt(numbers.length())));
        password.append(specialChars.charAt(random.nextInt(specialChars.length())));

        // Remplir le reste
        for (int i = 4; i < 12; i++) {
            password.append(allChars.charAt(random.nextInt(allChars.length())));
        }

        // Mélanger le mot de passe
        return shuffleString(password.toString());
    }

    private String shuffleString(String input) {
        List<Character> characters = new ArrayList<>();
        for (char c : input.toCharArray()) {
            characters.add(c);
        }
        Collections.shuffle(characters);
        StringBuilder result = new StringBuilder();
        for (char c : characters) {
            result.append(c);
        }
        return result.toString();
    }

    // Méthode isDisponible() - Getter alternatif pour la disponibilité
    public boolean isDisponible() {
        return disponibilite;
    }


    // Méthode utilitaire pour changer l'état
    public void changerDisponibilite() {
        this.disponibilite = !this.disponibilite;
    }

    // Méthode pour générer l'identifiantLivreur
    public String generateIdentifiantLivreur() {
        if (this.getNom() == null || this.getNom().isEmpty()) {
            throw new IllegalStateException("Le nom du livreur doit être défini avant de générer l'identifiant");
        }

        // Prendre les 3 premiers caractères du nom (ou le nom complet si moins de 3 caractères)
        String nomPrefix = this.getNom().length() > 3 ? 
                           this.getNom().substring(0, 3).toUpperCase() : 
                           this.getNom().toUpperCase();

        // Générer 4 chiffres aléatoires
        Random random = new Random();
        int randomNumber = 1000 + random.nextInt(9000); // Nombre entre 1000 et 9999

        return nomPrefix + randomNumber;
    }
}
