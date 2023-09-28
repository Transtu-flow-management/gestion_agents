package com.transtu.transtu.Document;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@Getter
@Setter
@NoArgsConstructor
@Document(collection = "conductor")
public class Conductor {
    @Id
    private Integer id;
    @Transient
    public static final String SEQUENCE_Cond_NAME = "conductor_sequence";
    private String name;
    private String surname;
    private String uid ;
    private byte type;
    @DBRef
    private Warehouse warehouse;
    private Date dateOfInsertion;
    private Date dateOfModification;
}
