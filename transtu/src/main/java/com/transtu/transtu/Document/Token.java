package com.transtu.transtu.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Token {
    @Transient
    public static final String SEQUENCE_NAME_TOKEN = "Token_sequence";
    @Id
    private Integer id;
    public String token;
    public TokenType tokenType = TokenType.BEARER;
    private boolean revoked;
    private boolean expired;
    @DBRef
    public Agent agent;

}
