package com.transtu.transtu.Service;

import com.transtu.transtu.Controller.RoleController;
import com.transtu.transtu.Document.Permissions;
import com.transtu.transtu.Document.Role;
import com.transtu.transtu.Handlers.NotFoundExcemptionhandler;
import com.transtu.transtu.Repositoy.RoleRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class RoleService {
    @Autowired
    private RoleRepo roleRepo;
    public Role getRolebyId(Integer id){
        return roleRepo.findById(id).orElseThrow(()->new NoSuchElementException("Role introuvable"));
    }

  /*  public List<Role> getAllRoles() {
        return roleRepo.findAll();
    }*/
    public Page<Role>getAllRoles(Pageable peg){
        return roleRepo.findAll(peg);
    }
    public EntityModel<Role> CreateRole(Role role){
        if (roleRepo.existsByRoleName(role.getRoleName())){
            throw new IllegalArgumentException("Role avec le meme nom deja existant");
        }
        role.setDateOfCreation(new Date());

        Role savedRole = roleRepo.save(role);
        WebMvcLinkBuilder selflink = WebMvcLinkBuilder.linkTo(RoleController.class).slash(savedRole.getId());
     EntityModel<Role> roleentity = EntityModel.of(savedRole);
     roleentity.add(selflink.withSelfRel());
     return roleentity;
    }
    public Role updateRole(Integer id,Role role) {
        Role newrole = roleRepo.findById(id).orElseThrow(() -> new NoSuchElementException(("Role introuvable")));
        newrole.setRoleName(role.getRoleName());
        //newrole.setPermissions(role.getPermissions());
        newrole.setDateOfModification(new Date());
        return roleRepo.save(newrole);
    }
    public void Deleteall(){
        roleRepo.deleteAll();
    }
    public Role assignPermstoRole(Integer roleid, Set<String> permissionNames){
        Role role = roleRepo.findById(roleid).orElseThrow(()-> new NotFoundExcemptionhandler(roleid));
        Set<Permissions> permissions = permissionNames.stream()
                        .map(Permissions::fromstring)
                                .collect(Collectors.toSet());
        role.setPermissions(permissions);
        roleRepo.save(role);
        return role;
    }

    public Role removepermissionfromRole(Integer roleid,Permissions permission){
        Role role = roleRepo.findById(roleid).orElseThrow(()-> new NotFoundExcemptionhandler(roleid));
       role.getPermissions().remove(permission);
       roleRepo.save(role);
       return role;
}
}
