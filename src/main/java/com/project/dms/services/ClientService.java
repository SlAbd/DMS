package com.project.dms.services;


import com.project.dms.domains.entities.Client;
import com.project.dms.domains.entities.Colis;
import com.project.dms.repositories.ClientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ClientService {


    private final PasswordEncoder   passwordEncoder;


    private ClientRepository clientRepository;

    public List<Client> getAllClients() {
        return clientRepository.findAll();
    }

    public Optional<Client> getClientById(Long id) {
        return clientRepository.findById(id);
    }

    public Client saveClient(Client client) {
        return clientRepository.save(client);
    }

    public void deleteClient(Long id) {
        clientRepository.deleteById(id);
    }

    public boolean updatePassword(Long userId, String newPassword) {
        // Récupération du client
        Client client = clientRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Client introuvable"));

        // (Optionnel) Vérifier que l’email n’appartient pas à un autre utilisateur
        clientRepository.findByEmail(client.getEmail())
                .filter(c -> !c.getId().equals(userId))
                .ifPresent(c -> { throw new IllegalArgumentException("Email déjà utilisé"); });

        // Mise à jour du mot de passe
        client.setMotDePasse(passwordEncoder.encode(newPassword));
        clientRepository.save(client);

        return true;
    }


}