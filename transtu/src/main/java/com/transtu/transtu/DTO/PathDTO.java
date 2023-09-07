package com.transtu.transtu.DTO;


import com.transtu.transtu.Document.Line;
import com.transtu.transtu.Document.Stop;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.util.Date;
import java.util.List;

@Getter
@Setter
public class PathDTO {
    private Line line;
    private String id;
    private String startFr;
    private String startAr;
    private String endFr;
    private String endAr;
    private Byte type;
    private String data;


}
