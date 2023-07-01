package com.transtu.transtu.Document;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@Getter
@Setter
@NoArgsConstructor
@Document(collection = "marque")
public class Brand {
    @Id
    private String id;
    private String name;
    private String maker;
    private Date dateOfInsertion;
    private Date dateOfModification;

}
