package com.project.dms.domains.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@EqualsAndHashCode(callSuper = true)
@DiscriminatorValue("LIVREUR")
public class Livreur extends User {
    private String adresse;
    private String telephone;
    private String vehicule;
    private boolean disponibilite;
}
