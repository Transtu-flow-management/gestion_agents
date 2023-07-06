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
@Document(collection = "Paths")
public class Path {
    @Id
    private String id;
    @DBRef
    private Line line;
    private String nameFr;
    private String nameAr;
    private Byte type;
    private Date dateOfInsertion;
    private Date dateOfModification;
}
