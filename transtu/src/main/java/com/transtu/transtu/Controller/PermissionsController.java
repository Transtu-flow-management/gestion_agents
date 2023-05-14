package com.transtu.transtu.Controller;

import com.transtu.transtu.Document.Permissions;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/permissions")
public class PermissionsController {
    @GetMapping
    public ResponseEntity<List<String>> getAllPermissions() {
        List<String> permissions = Arrays.stream(Permissions.values())
                .map(Permissions::name)
                .collect(Collectors.toList());
        return ResponseEntity.ok(permissions);
    }

}
