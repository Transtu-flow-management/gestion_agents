package com.transtu.transtu.Document;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.io.Serializable;
import java.util.*;
import java.util.stream.Collectors;

@Document(collection = "Roles")
@Data
@Getter
@Setter
@AllArgsConstructor
public class Role {
    @Id
    private Integer id;
    private String roleName;
    @JsonFormat(pattern = "yyyy-MM-dd:HH:mm:ss", timezone = "UTC")
    private Date dateOfCreation;
    @JsonFormat(pattern = "yyyy-MM-dd:HH:mm:ss", timezone = "UTC")
    private Date dateOfModification;
    private Boolean containsPermissions;
    private List<Permissions> permissions;

    @Transient
    public static final String SEQUENCE_NAME_Role = "role_sequence";

    public List<Permissions>getPermissions(){
        return permissions;
    }
    public Role() {
        this.permissions = new ArrayList<>();
    }



    public List<SimpleGrantedAuthority> getAuthorities() {
        var authorities = getPermissions()
                .stream()
                .map(permission -> new SimpleGrantedAuthority(permission.getPermissionName()))
                .collect(Collectors.toList());
        authorities.add(new SimpleGrantedAuthority("ROLE_" + this.roleName));
        return authorities;
    }


}
