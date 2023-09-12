package com.transtu.transtu.Service;

import com.transtu.transtu.Controller.RoleController;
import com.transtu.transtu.Document.Permissions;
import com.transtu.transtu.Document.Role;
import com.transtu.transtu.Handlers.NotFoundExcemptionhandler;
import com.transtu.transtu.Repositoy.RoleRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.management.relation.RoleNotFoundException;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class RoleService {
    @Autowired
    private RoleRepo roleRepo;


    public List<Role> getAllRoles() {
        return roleRepo.findAll();
    }

    public Page<Role> getAllRolesP(Pageable peg) {
        Page<Role> roles = roleRepo.findAll(peg);
        return roles;
    }

    public Role CreateRole(Role role) {
        if (roleRepo.existsByRoleName(role.getRoleName())) {
            throw new IllegalArgumentException("Role avec le meme nom deja existant");
        }
        role.setDateOfCreation(new Date());
        Role savedRole = roleRepo.save(role);
        return savedRole;
    }

    public Role updateRole(Integer id, Role role) {
        Role newrole = roleRepo.findById(id).orElseThrow(() -> new NoSuchElementException(("Role introuvable")));
        newrole.setRoleName(role.getRoleName());
        //newrole.setPermissions(role.getPermissions());
        newrole.setDateOfModification(new Date());
        return roleRepo.save(newrole);
    }

    public void Deleteall() {
        roleRepo.deleteAll();
    }

    @Transactional
    public Role assignPermissionsToRole(Integer roleId, Set<String> permissionNames) {
        Role role = roleRepo.findById(roleId).orElseThrow(() -> new NotFoundExcemptionhandler(roleId));

        List<Permissions> permissions = permissionNames.stream()
                .map(Permissions::fromstring)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        role.setPermissions(permissions);
        role.setContainsPermissions(!permissions.isEmpty());
        return roleRepo.save(role);
    }
    public void removePermissionFromRole(Integer roleId, Permissions permission) {
        Optional<Role> roleOptional = roleRepo.findById(roleId);
        if (roleOptional.isPresent()) {
            Role role = roleOptional.get();
            List<Permissions> permissions = role.getPermissions();

            // Remove the permission from the role only if it exists in the permissions list
            if (permissions.contains(permission)) {
                permissions.remove(permission);
                role.setPermissions(permissions);
                roleRepo.save(role);
            }
        }
    }
}
