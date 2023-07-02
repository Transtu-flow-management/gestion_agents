package com.transtu.transtu.Document;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.Set;

@Getter
@Setter
@RequiredArgsConstructor
@Document(collection = "depots")
public class Warehouse {
    @Id
    private Integer id;
    private String name;
    private Double longitude;
    private Double lattitude;
    private Integer capacite;
    private String adresse;
    private String Description;

   // private Set<Networks> Networks;
    private String selectedReseau;
    private Date dateOfInsertion;
    private Date dateOfModification;

    @Transient
    public static final String SEQUENCE_NAME_Depot = "depot_sequence";
}
