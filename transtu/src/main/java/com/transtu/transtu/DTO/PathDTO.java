package com.transtu.transtu.DTO;


import lombok.Getter;
import lombok.Setter;

import java.util.Date;
@Getter
@Setter
public class PathDTO {

    private String id;

    private String line;
    private String nameFr;
    private String nameAr;
    private Byte type;
    private Date dateOfInsertion;
    private Date dateOfModification;
}
