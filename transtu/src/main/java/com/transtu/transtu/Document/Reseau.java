package com.transtu.transtu.Document;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;

import java.util.Date;
@Getter
@Setter
@AllArgsConstructor
public class Reseau {
    @Id
    private Integer id;
    private String name;
    private Date dateOfInsertion;
    private Date dateOfModification;

}
