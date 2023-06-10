package com.transtu.transtu.DTO;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.transtu.transtu.Document.Role;
import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;
import java.util.Set;

@Getter
@Setter

public class AgentDTO {
    private Integer Id;
    private String name;
    private String prenom;
    private String email;

    private String username;
    private String phone;
    private String imageUrl;

    private String roleName;
    //@JsonFormat(pattern = "yyyy-MM-dd:HH:mm:ss", timezone = "UTC")
    private Date dateOfInsertion;
    //@JsonFormat(pattern = "yyyy-MM-dd:HH:mm:ss", timezone = "UTC")
    private Date dateOfModification;

}
