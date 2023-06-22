package com.transtu.transtu.Document;

import lombok.Data;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;

import java.util.Date;

@Data
@Getter
@Setter
@RequiredArgsConstructor
public class Marque {
    @Id
    private String id;
    private String name;
    private String fabriquant;
    private Date dateOfInsertion;
    private Date dateOfModification;

}
