package com.project.dms.services;

import com.project.dms.api.requests.LoginRequest;
import com.project.dms.api.requests.RegisterRequest;
import com.project.dms.domains.enums.Role;
import com.project.dms.domains.entities.User;
import com.project.dms.repositories.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Inscription d'un nouvel utilisateur
     */
    public String register(RegisterRequest request) {
        // Vérifier si l'email existe déjà
        if (userRepository.findByEmail(request.email()).isPresent()) {
            return "Email déjà utilisé !";
        }

        // Créer et sauvegarder l'utilisateur
        User newUser = new User();
        
        newUser.setNom(request.nom());
        newUser.setEmail(request.email());
        newUser.setMotDePasse(passwordEncoder.encode(request.motDePasse())); // Mot de passe sécurisé
        newUser.setRole(request.role() != null ? request.role() : Role.CLIENT); // Par défaut CLIENT

        userRepository.save(newUser);
        return "Inscription réussie !";
    }

    /**
     * Authentification d'un utilisateur
     */
    public String login(LoginRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.email());

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // Vérifier le mot de passe avec BCrypt
            if (passwordEncoder.matches(request.motDePasse(), user.getMotDePasse())) {
                return "Connexion réussie !";
            }
        }

        return "Échec de l'authentification. Email ou mot de passe incorrect.";
    }
}
