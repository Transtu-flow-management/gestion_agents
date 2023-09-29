package com.transtu.transtu.Document;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;


@Getter
@Setter
@Document(collection = "#{T(com.transtu.transtu.SecondaryRepo.CollectionNameHolder).get()}")
@NoArgsConstructor
public class GPS {
    @Id
    private String id;
    private String matricule;
    private Double lat;
    private Double lang;
    private Double alt;
    private Double speed;
    private Double bearing;
    private Double acc;
    private String addr;
    private String runningtime;
    private String versionandroid;
}
