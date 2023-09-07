package com.transtu.transtu.Document;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.transtu.transtu.DTO.StopDTO;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Getter
@Setter
@Document(collection = "Paths")
public class Path {
    @Id
    private String id;
    @DBRef
    private Line line;
    private String startFr;
    private String startAr;
    private String endFr;
    private String endAr;
    private String data;
    private Byte type;
    @DBRef
    private List<Stop> stops ;

    private Date dateOfInsertion;
    private Date dateOfModification;
    public Path() {

        this.stops = new ArrayList<>();
    }
    public void delete(Stop stop) {
        if (stop != null) {
            this.stops.remove(stop);
        }
    }
}
