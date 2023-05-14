package com.transtu.transtu.Controller;

import com.transtu.transtu.Document.Permissions;
import com.transtu.transtu.Document.Role;
import com.transtu.transtu.Service.RoleService;
import com.transtu.transtu.Service.SequenceGeneratorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

import static com.transtu.transtu.Document.Agent.SEQUENCE_NAME;
import static com.transtu.transtu.Document.Role.SEQUENCE_NAME_Role;


@RestController
@RequestMapping("/api/roles")
public class RoleController {
    @Autowired
    private RoleService roleService;
    @Autowired
    SequenceGeneratorService mongo;
    @PostMapping("/add")
    private ResponseEntity<Role> CreateRole(@RequestBody Role role){
        role.setId(mongo.generateSequence(SEQUENCE_NAME_Role));
        Role createrole = roleService.CreateRole(role);
        return ResponseEntity.ok(createrole);
    }
    @GetMapping
    public ResponseEntity<List<Role>> getAllRoles() {
        List<Role> roles = roleService.getAllRoles();
        return ResponseEntity.ok(roles);
    }
    @DeleteMapping("/deleteall")
    private ResponseEntity<String> deleteAll(){

        roleService.Deleteall();
        mongo.resetSequence(SEQUENCE_NAME_Role);
        return ResponseEntity.ok("all Roles are gone");
    }
    @PostMapping("/{roleid}/permissions")
    public ResponseEntity<?> assignPermsToRole(@PathVariable Integer roleid, @RequestBody Set<Permissions> permission){
        roleService.assignPermstoRole(roleid,permission);
        return ResponseEntity.ok("permissions are assigned to role");
    }
}
