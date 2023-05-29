package com.transtu.transtu.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/testsec")
public class SecureController {
    @GetMapping
    private ResponseEntity<String> testmessage(){
        return ResponseEntity.ok("c\'est un message de test d(authentification");
    }
}
