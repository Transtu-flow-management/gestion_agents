package com.transtu.transtu.Document;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@NoArgsConstructor
@Getter
@Setter
@Document(collection = "Cars")
public class Car {
    @Id
    private String id;
    private String name;
    private String matricule;
    @DBRef
    private Conductor driver;
    @DBRef
    private Condition state;
    @DBRef
    private Brand brand;
    @DBRef
    private Path path;
    @DBRef
    private Line line;
    @DBRef
    private Warehouse warehouse;
    private String selectedNetwork; //bus metro tgm
    private Byte mode; //stnd , double
    private Integer stopcount;
    private Date sendtimer;
    private Double lat;
    private Double lng;

    private Date dateOfInsertion;
    private Date dateOfModification;

}
