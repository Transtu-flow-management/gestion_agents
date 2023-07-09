package com.transtu.transtu.DTO;

import com.transtu.transtu.Document.Warehouse;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.util.Date;
@Getter
@Setter
public class LineDTO {

    private String id;
    private String nameFr;
    private String nameAr;
    private String start_fr;
    private String start_ar;
    private String end_fr;
    private String end_ar;

    private String warehouseName;
    private Date dateOfInsertion;
    private Date dateOfModification;

}
