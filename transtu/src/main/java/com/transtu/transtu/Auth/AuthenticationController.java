package com.transtu.transtu.Auth;
import com.transtu.transtu.Document.Agent;
import com.transtu.transtu.Service.AuthenticationService;
import com.transtu.transtu.Service.JwtService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;

@RestController
@CrossOrigin(originPatterns = "*",allowCredentials = "true")
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {
        @Autowired
        private final AuthenticationService service;
        @Autowired
        private final JwtService jwtService;

       @PostMapping("/register")
       //@PreAuthorize("hasAuthority('write')")
        public ResponseEntity<AuthenticationResponse> register(Agent request, @RequestParam(required = false) MultipartFile file) {
            return ResponseEntity.ok(service.register(request,file));
        }
        @PostMapping("/authenticate")
        public ResponseEntity<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request,HttpServletResponse response) {
            return ResponseEntity.ok(service.authenticate(request,response));
        }

        @GetMapping("/refresh-token")
        public void refreshToken(HttpServletRequest request,HttpServletResponse response) throws IOException {
            service.refreshToken(request, response);
        }

    @GetMapping("/check")
    public ResponseEntity<String> checkAuthentication(HttpServletRequest request, HttpServletResponse response) {
        if (userIsAuthenticated(request)) {
            return ResponseEntity.ok("User is authenticated");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User is not authenticated");
        }
    }
    private boolean userIsAuthenticated(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();

        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("refreshToken")) {
                    String accessToken = cookie.getValue();
                    if (!jwtService.isTokenExpired(accessToken)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

}
