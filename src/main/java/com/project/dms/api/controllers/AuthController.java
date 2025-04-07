package com.project.dms.api.controllers;

import com.project.dms.api.requests.LoginRequest;
import com.project.dms.api.requests.RegisterRequest;
import com.project.dms.services.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        String response = authService.register(request);
        return response.equals("Inscription réussie !") ? 
            ResponseEntity.ok(response) : ResponseEntity.badRequest().body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest request) {
        String response = authService.login(request);
        return response.equals("Connexion réussie !") ? 
            ResponseEntity.ok(response) : ResponseEntity.status(401).body(response);
    }
}
