package com.project.dms.api.controllers;

import com.project.dms.api.requests.LoginRequest;
import com.project.dms.api.requests.RegisterRequest;
import com.project.dms.api.responses.AuthResponse;
import com.project.dms.services.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return response.getMessage().equals("Inscription réussie !") ? 
            ResponseEntity.ok(response) : ResponseEntity.badRequest().body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return response.getMessage().equals("Connexion réussie !") ? 
            ResponseEntity.ok(response) : ResponseEntity.status(401).body(response);
    }
}
