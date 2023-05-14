package com.transtu.transtu.Service;

import com.transtu.transtu.Controller.RoleController;
import com.transtu.transtu.Document.Permissions;
import com.transtu.transtu.Document.Role;
import com.transtu.transtu.Handlers.NotFoundExcemptionhandler;
import com.transtu.transtu.Repositoy.RoleRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
public class RoleService {
    @Autowired
    private RoleRepo roleRepo;

    public List<Role> getAllRoles() {
        return roleRepo.findAll();
    }
    public EntityModel<Role> CreateRole(Role role){
        if (roleRepo.existsByRoleName(role.getRoleName())){
            throw new IllegalArgumentException("Role avec le meme nom deja existant");
        }
        Role savedRole = roleRepo.save(role);
        WebMvcLinkBuilder selflink = WebMvcLinkBuilder.linkTo(RoleController.class).slash(savedRole.getId());
     EntityModel<Role> roleentity = EntityModel.of(savedRole);
     roleentity.add(selflink.withSelfRel());
     return roleentity;
    }
    public void Deleteall(){
        roleRepo.deleteAll();
    }
    public Role assignPermstoRole(Integer roleid, Set<Permissions> permission){
        Role role = roleRepo.findById(roleid).orElseThrow(()-> new NotFoundExcemptionhandler(roleid));
        role.setPermissions(permission);
        roleRepo.save(role);
        return role;
    }
}
