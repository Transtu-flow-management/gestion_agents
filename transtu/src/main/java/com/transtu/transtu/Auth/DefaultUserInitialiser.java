package com.transtu.transtu.Auth;

import com.transtu.transtu.Document.Agent;
import com.transtu.transtu.Document.Permissions;
import com.transtu.transtu.Document.Role;
import com.transtu.transtu.Service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Date;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DefaultUserInitialiser implements CommandLineRunner {
    @Autowired
    private final AuthenticationService service;
    @Override
    public void run(String... args) throws Exception {
        if (!service.userExists("admin@transtu.tn")){
            Agent defaultagent = new Agent();
            defaultagent.setName("charfi");
            defaultagent.setSurname("mehrez");
            defaultagent.setUsername("admin@transtu.tn");
            defaultagent.setPassword("admin@transtu.tn");
            Role role = new Role();
            role.setRoleName("ROLE_ADMIN");
            role.setDateOfCreation(new Date());
            role.setContainsPermissions(true);
            List<Permissions> permissionsList = Arrays.asList(Permissions.WRITE, Permissions.UPDATE, Permissions.READ);
            role.setPermissions(permissionsList);
            defaultagent.setImageUrl("Emptyfile");
            defaultagent.setRole(role);
            AuthenticationResponse response = service.register(defaultagent, null);
        }
    }
}
