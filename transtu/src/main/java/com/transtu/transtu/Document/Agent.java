package com.transtu.transtu.Document;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Document(collection = "Agents")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter

@Setter
public class Agent implements UserDetails {
    @Transient
    public static final String SEQUENCE_NAME = "agent_sequence";
    @Id
    private Integer id;
    private String name;
    private String prenom;
    private String email;
    private String username;
    private String password;
    private String imageUrl;
    private Boolean isEnabled =false;
    @DBRef
    private Set<Role> roles = new HashSet<>();
    //@JsonFormat(pattern = "yyyy-MM-dd:HH:mm:ss", timezone = "UTC")
    private Date dateOfInsertion;
   // @JsonFormat(pattern = "yyyy-MM-dd:HH:mm:ss", timezone = "UTC")
    private Date dateOfModification;
    public void addRole(Role role){
        roles.add(role);
    }
    public void deleteRole(Role role){
        roles.remove(role);
    }


    // private Set<Role> roles;

    /* @JsonIgnore
     @Override
     public Collection<? extends GrantedAuthority> getAuthorities() {
         roles.forEach(r ->System.out.println(r.getRoleName()));
         return roles.stream().map(role -> new SimpleGrantedAuthority(role.getRoleName())).collect(Collectors.toSet());
     }*/
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles.stream()
                .map(role -> new SimpleGrantedAuthority(role.getRoleName()))
                .collect(Collectors.toSet());
    }
    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
