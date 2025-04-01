package com.project.dms.domains.entities;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "colis")
public class Colis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

 
    public Colis() {}

 

    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

}
