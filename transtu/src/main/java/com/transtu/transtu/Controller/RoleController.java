package com.transtu.transtu.Controller;

import com.transtu.transtu.DTO.AgentDTO;
import com.transtu.transtu.Document.Agent;
import com.transtu.transtu.Document.Permissions;
import com.transtu.transtu.Document.Role;
import com.transtu.transtu.Repositoy.AgentRepo;
import com.transtu.transtu.Repositoy.RoleRepo;
import com.transtu.transtu.Service.RoleService;
import com.transtu.transtu.Service.SequenceGeneratorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.IanaLinkRelations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static com.transtu.transtu.Document.Role.SEQUENCE_NAME_Role;
@RestController
@CrossOrigin("*")
@RequestMapping("/api/roles")
public class RoleController {
    @Autowired
    SequenceGeneratorService mongo;
    @Autowired
    private RoleRepo roleRepo;
    @Autowired
    private AgentRepo agentRepo;
    @Autowired
    private RoleService roleService;

    //utilisation de Hateoas method Restful API
    @PostMapping("/add")
   // @PreAuthorize("hasAuthority('writeRole')")
    private ResponseEntity<Role> CreateRole(@RequestBody Role role ){
        role.setId(mongo.generateSequence(SEQUENCE_NAME_Role));
       this.roleService.CreateRole(role);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
    @GetMapping("/Pages")
   // @PreAuthorize("hasAuthority('readRole')")
    public Page<Role> getRoles(@RequestParam(defaultValue = "0") int page,
                               @RequestParam(defaultValue = "4") int size){
        Pageable pageable = PageRequest.of(page,size);
        return roleService.getAllRolesP(pageable);
    }
    @GetMapping
  //  @PreAuthorize("hasAuthority('readRole')")
    public ResponseEntity<List<Role>> getAllRoles() {
        List<Role> roles = roleService.getAllRoles();
        return ResponseEntity.ok(roles);
    }
    @DeleteMapping("/deleteall")
   // @PreAuthorize("hasAuthority('deleteRole')")
    private ResponseEntity<String> deleteAll(){
        roleService.Deleteall();
        mongo.resetSequence(SEQUENCE_NAME_Role);
        return ResponseEntity.ok("all Roles are gone");
    }
    @PutMapping("/update/{roleid}")
   // @PreAuthorize("hasAuthority('updateRole')")
    private ResponseEntity<Role> updateRole(@PathVariable Integer roleid, @RequestBody Role role){
         this.roleService.updateRole(roleid,role);

        return ResponseEntity.status(HttpStatus.OK).build();
    }
    @PostMapping("/{roleid}/permissions")
   // @PreAuthorize("hasAuthority('AssignPermissions')")
    public ResponseEntity<?> assignPermsToRole(@PathVariable Integer roleid, @RequestBody Set<String> permission){
        roleService.assignPermissionsToRole(roleid,permission);
        return ResponseEntity.status(HttpStatus.OK).build();
    }
   // @CacheEvict(value = "cachedRoles", allEntries=true)
    @DeleteMapping("/delete/{roleid}")
   // @PreAuthorize("hasAuthority('deleteRole')")
    public ResponseEntity<?>deleteRole(@PathVariable("roleid") Integer roleid,@RequestParam(required = false) boolean confirmDelete){
        Optional<Role> optionalrole = roleRepo.findById(roleid);
        if(optionalrole.isEmpty()){
            return ResponseEntity.notFound().build();
        }
        Role role = optionalrole.get();
        List<Agent> associatedAgents = agentRepo.findByRole(role);
        if(!associatedAgents.isEmpty() && !confirmDelete){
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
        for (Agent agent : associatedAgents) {
            agent.deleteRole(role);
            agentRepo.save(agent);
            roleRepo.deleteById(roleid);
        }
        return ResponseEntity.status(HttpStatus.OK).build();
    }
    @DeleteMapping("/delete/{roleid}/permission/{permission}")
   // @PreAuthorize("hasAuthority('AssignPermissions')")
    public ResponseEntity<?>deletepermissionfromRole(@PathVariable("roleid") Integer roleid,@PathVariable("permission") Permissions permission){
       Optional<Role> delroleperm = roleRepo.findById(roleid);
       if(delroleperm.isEmpty()){
           return ResponseEntity.notFound().build();
       }
       roleService.removePermissionFromRole(roleid,permission);
       return ResponseEntity.ok(HttpStatus.OK);
    }

}
