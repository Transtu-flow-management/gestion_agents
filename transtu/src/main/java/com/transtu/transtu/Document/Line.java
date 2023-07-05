package com.transtu.transtu.Document;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@Getter
@Setter
@Document(collection = "Lines")
public class Line {
    @Id
    private String id;
    private String nameFr;
    private String nameAr;
    private String start_fr;
    private String start_ar;
    private String end_fr;
    private String end_ar;
    @DBRef
    private Warehouse warehouse;
    private Date dateOfInsertion;
    private Date dateOfModification;

}
