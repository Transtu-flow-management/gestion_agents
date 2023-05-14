package com.transtu.transtu.Document;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.HashSet;
import java.util.Set;

@Document(collection = "Roles")
@Data
@Getter
@Setter
public class Role {
    @Id
    private Integer id;
    private String roleName;
private Set<Permissions> permissions;
    @Transient
    public static final String SEQUENCE_NAME_Role = "role_sequence";
    public Role() {
        this.permissions = new HashSet<>();
    }

    public void AddPermissions(Permissions permission){
        permissions.add(permission);
    }
    public void RemovePermission(Permissions permission){
        permissions.remove(permission);
    }
    public Set<Permissions>getPermissions(){
        return permissions;
    }

}
