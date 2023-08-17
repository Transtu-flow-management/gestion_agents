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
@Getter
@Setter
@NoArgsConstructor
@Document(collection = "Stops")
public class Stop {
    @Id
    private String id;
    private String name_fr;
    private String name_ar;
    private double lat;
    private double lng;
    private int stopnumber;
    @DBRef
    private Path path;
    private String description;
    private Date dateOfInsertion;
    private Date dateOfModification;
}
