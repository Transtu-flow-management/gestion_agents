package com.transtu.transtu.Auth;
import com.transtu.transtu.DTO.SignUpRequest;
import com.transtu.transtu.Document.Agent;
import com.transtu.transtu.Service.AuthenticationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {
        @Autowired
        private final AuthenticationService service;

       @PostMapping("/register")
        public ResponseEntity<AuthenticationResponse> register(Agent request, @RequestParam MultipartFile file) {
            return ResponseEntity.ok(service.register(request,file));
        }
        @PostMapping("/authenticate")
        public ResponseEntity<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request) {
            return ResponseEntity.ok(service.authenticate(request));
        }

        @PostMapping("/refresh-token")
        public void refreshToken(HttpServletRequest request,HttpServletResponse response) throws IOException {
            service.refreshToken(request, response);
        }

    }
