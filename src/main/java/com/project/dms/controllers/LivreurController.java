package com.project.dms.controllers;


import com.project.dms.domains.entities.Livreur;
import com.project.dms.services.LivreurService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/livreurs")
public class LivreurController {

    @Autowired
    private LivreurService livreurService;

    @GetMapping
    public List<Livreur> getAllLivreurs() {
        return livreurService.getAllLivreurs();
    }

    @GetMapping("/{id}")
    public Optional<Livreur> getLivreurById(@PathVariable Long id) {
        return livreurService.getLivreurById(id);
    }

    @PostMapping
    public Livreur saveLivreur(@RequestBody Livreur livreur) {
        return livreurService.saveLivreur(livreur);
    }

    @DeleteMapping("/{id}")
    public void deleteLivreur(@PathVariable Long id) {
        livreurService.deleteLivreur(id);
    }
}