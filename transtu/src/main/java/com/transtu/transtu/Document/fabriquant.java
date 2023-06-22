package com.transtu.transtu.Document;

import lombok.Data;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;

@Getter
@Setter
@RequiredArgsConstructor
@Data
public class fabriquant {
    @Id
    private String id;
    private String name;
}
