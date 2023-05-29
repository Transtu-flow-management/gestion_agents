package com.transtu.transtu.Document;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
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
    @JsonFormat(pattern = "yyyy-MM-dd:HH:mm:ss", timezone = "UTC")
    private Date dateOfCreation;
    @JsonFormat(pattern = "yyyy-MM-dd:HH:mm:ss", timezone = "UTC")
    private Date dateOfModification;
private Set<Permissions> permissions;
    private Set<String> permissionNames;
    @Transient
    public static final String SEQUENCE_NAME_Role = "role_sequence";
    public Role() {
        this.permissions = new HashSet<>();
        this.permissionNames=new HashSet<>();
    }

    public void AddPermissions(Permissions permission){
        permissions.add(permission);
        permissionNames.add(permission.getPermissionName());
    }
    public void RemovePermission(Permissions permission){
        permissions.remove(permission);
        permissionNames.remove(permission.getPermissionName());
    }
    public Set<Permissions>getPermissions(){
        return permissions;
    }

}
