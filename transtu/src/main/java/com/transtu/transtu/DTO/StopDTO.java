package com.transtu.transtu.DTO;

import com.transtu.transtu.Document.Path;
import com.transtu.transtu.Document.Permissions;
import com.transtu.transtu.Document.Stop;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.DBRef;

@Getter
@Setter
public class StopDTO {
    private String id;
    private String name_fr;
    private String name_ar;
    private double lat;
    private double lng;
    private int stopnumber;

    private byte stopType;
    private String description;


}
