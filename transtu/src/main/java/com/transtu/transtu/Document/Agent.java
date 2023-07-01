package com.transtu.transtu.Document;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
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
    private String surname;
    private String email;
    private String username;

    private String password;
    private String phone;

    private String imageUrl;
    @JsonIgnore
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
        if (!roles.equals(null))
        roles.remove(role);
    }


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

    @JsonIgnore
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }
    @Override
    @JsonIgnore
    public boolean isAccountNonLocked() {
        return true;
    }
    @JsonIgnore
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }
    @JsonIgnore
    @Override
    public boolean isEnabled() {
        return true;
    }
}
