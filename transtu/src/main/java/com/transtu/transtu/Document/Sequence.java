package com.transtu.transtu.Document;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@NoArgsConstructor
@Document(collection = "Sequence")
public class Sequence {
    @Id
    private String id;
    private int sequanceValue;
}
