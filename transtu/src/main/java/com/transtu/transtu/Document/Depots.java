package com.transtu.transtu.Document;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.util.Date;
@Getter
@Setter
@RequiredArgsConstructor
public class Depots {
    @Id
    private Integer id;
    private String name;
    private Double longitude;
    private Double lattitude;
    private Integer capacite;
    private String adresse;
    @DBRef
    public Reseau reseau;
    private String Description;
    private Date dateOfInsertion;
    private Date dateOfModification;

    @Transient
    public static final String SEQUENCE_NAME_Depot = "depot_sequence";
}
