package com.transtu.transtu.Document;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDate;
import java.util.*;
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
    private String username;
    private String address;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate DateOfBirth;
    private String password;
    private String phone;
    @DBRef
    private Warehouse warehouse;

    private String imageUrl;
    @JsonIgnore
    private Boolean isEnabled =false;
    @DBRef
    private Role role;
    //@JsonFormat(pattern = "yyyy-MM-dd:HH:mm:ss", timezone = "UTC")
    private Date dateOfInsertion;
    // @JsonFormat(pattern = "yyyy-MM-dd:HH:mm:ss", timezone = "UTC")
    private Date dateOfModification;
    public void addRole(Role role){
        this.role=role;
    }
    public void deleteRole(Role role){
        if (role != null) {
            this.role = null;

        }
    }
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if (role != null) {
            return role.getAuthorities();
        }
        return Collections.emptyList();
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
