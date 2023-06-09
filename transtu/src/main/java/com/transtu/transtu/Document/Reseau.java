package com.transtu.transtu.Document;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;

import java.util.Date;
@Getter
@Setter
@RequiredArgsConstructor
public class Reseau {
    @Id
    private Integer id;
    private String name;
    private Date dateOfInsertion;
    private Date dateOfModification;
    @Transient
    public static final String SEQUENCE_NAME_RES = "reseau_sequence";
}
