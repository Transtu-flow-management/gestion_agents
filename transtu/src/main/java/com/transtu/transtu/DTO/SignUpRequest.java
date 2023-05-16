package com.transtu.transtu.DTO;

import com.transtu.transtu.Document.Role;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SignUpRequest {

    @Transient
    public static final String SEQUENCE_NAME_Signup = "signup_sequence";

   // private String nom;
    //private String prenom;
    //private String email;
    private String username;
    private String password;
    //private Set<Role> roles;
}
