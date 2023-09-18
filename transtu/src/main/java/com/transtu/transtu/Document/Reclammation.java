package com.transtu.transtu.Document;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;
@Data
@Getter
@Setter
@Document(collection = "Reclamation")
@NoArgsConstructor
public class Reclammation {
    private String id;

    private String car;
    private String predifinedContext;
    private String context;
    private byte type;
    private String TimeOfIncident;
    private Date DateOfCreation;
    private String email;

}
