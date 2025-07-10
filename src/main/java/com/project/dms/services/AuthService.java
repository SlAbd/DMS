package com.project.dms.services;

import com.project.dms.api.requests.LoginRequest;
import com.project.dms.api.requests.RegisterRequest;
import com.project.dms.api.responses.AuthResponse;
import com.project.dms.domains.enums.Role;
import com.project.dms.domains.entities.User;
import com.project.dms.repositories.UserRepository;
import com.project.dms.security.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil,
            AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
    }

    /**
     * Inscription d'un nouvel utilisateur
     */
    public AuthResponse register(RegisterRequest request) {
        // Vérifier si l'email existe déjà
        if (userRepository.findByEmail(request.email()).isPresent()) {
            return AuthResponse.builder()
                    .message("Email déjà utilisé !")
                    .build();
        }

        // Créer et sauvegarder l'utilisateur
        User newUser = new User();

        newUser.setNom(request.nom());
        newUser.setEmail(request.email());
        newUser.setMotDePasse(passwordEncoder.encode(request.motDePasse())); // Mot de passe sécurisé
        newUser.setRole(request.role() != null ? request.role() : Role.CLIENT); // Par défaut CLIENT

        User savedUser = userRepository.save(newUser);

        // Générer un token JWT pour l'utilisateur
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", savedUser.getRole().name());

        UserDetails userDetails = org.springframework.security.core.userdetails.User.builder()
                .username(savedUser.getEmail())
                .password(savedUser.getMotDePasse())
                .authorities("ROLE_" + savedUser.getRole().name())
                .build();

        String token = jwtUtil.generateToken(claims, userDetails);

        // Retourner la réponse avec le token
        return AuthResponse.builder()
                .token(token)
                .userId(savedUser.getId())
                .nom(savedUser.getNom())
                .email(savedUser.getEmail())
                .role(savedUser.getRole())
                .message("Inscription réussie !")
                .build();
    }

    /**
     * Authentification d'un utilisateur
     */
    public AuthResponse login(LoginRequest request) {
        try {
            // Authentifier l'utilisateur avec Spring Security
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.email(),
                            request.motDePasse()
                    )
            );

            // Si l'authentification réussit, récupérer l'utilisateur
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();

            // Générer un token JWT pour l'utilisateur
            Map<String, Object> claims = new HashMap<>();
            claims.put("role", user.getRole().name());

            String token = jwtUtil.generateToken(claims, userDetails);

            // Retourner la réponse avec le token
            return AuthResponse.builder()
                    .token(token)
                    .userId(user.getId())
                    .nom(user.getNom())
                    .email(user.getEmail())
                    .role(user.getRole())
                    .message("Connexion réussie !")
                    .build();

        } catch (AuthenticationException e) {
            // En cas d'échec d'authentification
            return AuthResponse.builder()
                    .message("Échec de l'authentification. Email ou mot de passe incorrect.")
                    .build();
        }
    }
}
