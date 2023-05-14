package com.transtu.transtu.Document;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;
@AllArgsConstructor
@Getter
public enum Permissions {
    UPDATE("update"),
    READ("read"),
    WRITE("write");
    private final String permissionName;


}
