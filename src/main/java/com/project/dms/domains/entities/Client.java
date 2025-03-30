package com.project.dms.domains.entities;
import jakarta.persistence.*;
import lombok.*;
import com.project.dms.domains.enums.TypeClient;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@EqualsAndHashCode(callSuper = true)
@DiscriminatorValue("CLIENT")
public class Client extends User {

    private String adresse;
    private String telephone;

    @Enumerated(EnumType.STRING)
    private TypeClient typeClient;

    
}