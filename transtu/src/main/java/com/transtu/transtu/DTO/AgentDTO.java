package com.transtu.transtu.DTO;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Date;

@Getter
@Setter

public class AgentDTO {
    private Integer Id;
    private String name;
    private String surname;
    private String username;
    private String phone;
    private String imageUrl;
    private String address;
    private LocalDate DateOfBirth;

    private String roleName;
    //@JsonFormat(pattern = "yyyy-MM-dd:HH:mm:ss", timezone = "UTC")
    private Date dateOfInsertion;
    //@JsonFormat(pattern = "yyyy-MM-dd:HH:mm:ss", timezone = "UTC")
    private Date dateOfModification;

}
