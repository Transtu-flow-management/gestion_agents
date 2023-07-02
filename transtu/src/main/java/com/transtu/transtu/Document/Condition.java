package com.transtu.transtu.Document;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "condition")
public class Condition {
    @Id
    private String id;
    private String name;
    private Byte tracking;
    private Byte visibility;
    private Date dateOfInsertion;
    private Date dateOfModification;

}
