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
/*  "access_token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0c2VjdXJlZDEiLCJpYXQiOjE2ODg3MTgyNjMsImV4cCI6MTY4ODgwNDY2M30.PB11aewzdW-6swan_WIAZvH95LlsxMENsOyoLiaJ5to",
    "refresh_token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0c2VjdXJlZDEiLCJpYXQiOjE2ODg3MTgyNjMsImV4cCI6MTY4OTMyMzA2M30.MD_gzdBhCZ_0m1g_ssu4JFpxCeasQrOTwce5L6O8P-w",,*/