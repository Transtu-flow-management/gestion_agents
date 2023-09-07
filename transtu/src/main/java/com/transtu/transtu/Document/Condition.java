package com.transtu.transtu.Document;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;
import java.util.Date;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "condition")
public class Condition implements Serializable {
    @Id
    private String id;
    private String name;
    private Byte tracking;
    private Byte visibility;
    private Date dateOfInsertion;
    private Date dateOfModification;

}
