package com.transtu.transtu.DTO;

import com.transtu.transtu.Document.Role;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
public class AgentDTO {
    private int Id;
    private String username;
    private Set<String> roleName;
}
