package com.transtu.transtu.DTO;

import com.transtu.transtu.Document.Role;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
public class AgentDTO {
    private Integer Id;
    private String email;
    private String username;
    private Set<String> roleName;
    private String password;
    private Set<Role> roles;
}
