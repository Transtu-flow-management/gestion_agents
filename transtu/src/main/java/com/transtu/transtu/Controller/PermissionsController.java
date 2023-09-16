package com.transtu.transtu.Controller;

import com.transtu.transtu.Document.Permissions;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;
import java.util.stream.Collectors;
@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/permissions")
//@PreAuthorize("hasAuthority('write')")
public class PermissionsController {
    @GetMapping
    @PreAuthorize("hasAuthority('write')")
    public ResponseEntity<List<Map<String, Object>>> getAllPermissions() {
        List<Map<String, Object>> permissionsList = new ArrayList<>();
        for (Permissions permission : Permissions.values()) {
            Map<String, Object> permissionMap = new HashMap<>();
            permissionMap.put("permissionName", permission.getPermissionName());
            permissionMap.put("TYPE", permission);
            permissionMap.put("group",permission.getGroup());
            permissionsList.add(permissionMap);
        }
        return ResponseEntity.ok(permissionsList);
    }

}
