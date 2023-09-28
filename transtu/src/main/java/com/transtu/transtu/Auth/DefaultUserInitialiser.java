package com.transtu.transtu.Auth;

import com.transtu.transtu.Document.Agent;
import com.transtu.transtu.Document.Permissions;
import com.transtu.transtu.Document.Role;
import com.transtu.transtu.Repositoy.RoleRepo;
import com.transtu.transtu.Service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class DefaultUserInitialiser implements CommandLineRunner {
    @Autowired
    private final AuthenticationService service;
    @Autowired
    private RoleRepo roleRepo;
    @Override
    public void run(String... args) throws Exception {
        if (!service.userExists("admin@transtu.tn")){
            Agent defaultagent = new Agent();
            defaultagent.setName("charfi");
            defaultagent.setSurname("mehrez");
            defaultagent.setUsername("admin@transtu.tn");
            defaultagent.setPassword("admin@transtu.tn");
            Role roleexist = roleRepo.findByRoleName("SUPERADMIN");
            if (roleexist == null) {
              Role role = new Role();
              role.setId(999999);
                role.setRoleName("SUPERADMIN");
                role.setDateOfCreation(new Date());
                role.setContainsPermissions(true);
                Permissions[] allPermissions = Permissions.values();
                List<Permissions> permissionNames = Arrays.asList(allPermissions);
                role.setPermissions(permissionNames);

                roleRepo.save(role);
            }

            defaultagent.setImageUrl("Emptyfile");
            Permissions[] allPermissions = Permissions.values();
            List<Permissions> permissionNames = Arrays.asList(allPermissions);
                roleexist.setPermissions(permissionNames);
            defaultagent.setRole(roleexist);
            AuthenticationResponse response = service.register(defaultagent, null);
        }
    }
}
