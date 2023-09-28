package com.transtu.transtu.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.transtu.transtu.Auth.AuthenticationRequest;
import com.transtu.transtu.Auth.AuthenticationResponse;
import com.transtu.transtu.DTO.AgentDTO;

import jakarta.servlet.http.Cookie;
import com.transtu.transtu.Document.Agent;

import com.transtu.transtu.Document.Token;
import com.transtu.transtu.Document.TokenType;
import com.transtu.transtu.Repositoy.AgentRepo;
import com.transtu.transtu.Repositoy.TokenRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Date;

import static com.transtu.transtu.Document.Agent.SEQUENCE_NAME;
import static com.transtu.transtu.Document.Token.SEQUENCE_NAME_TOKEN;


@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final AgentRepo agentRepo;

    private final SequenceGeneratorService mongo;

    private final TokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    @Autowired
    private StoregeService storegeService;

    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(Agent request, MultipartFile file) {
        String fileName;
        if (file != null && !file.isEmpty()) {
            fileName = storegeService.CreateNameImage(file);
            storegeService.store(file, fileName);
        } else {
            fileName = "NO_FILE_PROVIDED";
        }
        Date currentDate = new Date();
        Integer signid = mongo.generateSequence(SEQUENCE_NAME);
        var user = Agent.builder()
                .id(signid)
                .name((request.getName()))
                .surname(request.getSurname())
                .phone((request.getPhone()))
                .address(request.getAddress())
                .password(passwordEncoder.encode(request.getPassword()))
                .dateOfInsertion(currentDate)
                .warehouse(request.getWarehouse())
                .imageUrl(fileName);
        if (!userExists(request.getUsername())){
            user.username(request.getUsername());
        }
        if (request.getRole() !=null){
            user.role(request.getRole());
        }
        if (request.getWarehouse() != null) {
            user.warehouse(request.getWarehouse());
        }
        if (request.getDateOfBirth() != null) {
            user.DateOfBirth(request.getDateOfBirth());
        }

        var savedUser = agentRepo.save(user.build());
        AgentDTO agentDTO = new AgentDTO();
        agentDTO.setImageUrl(savedUser.getImageUrl());
        agentDTO.setId(savedUser.getId());
        agentDTO.setSurname(savedUser.getSurname());
        agentDTO.setName(savedUser.getName());
        agentDTO.setAddress(savedUser.getAddress());
        agentDTO.setPhone(savedUser.getPhone());
        agentDTO.setUsername(savedUser.getUsername());
        if (savedUser.getWarehouse() != null) {
            agentDTO.setWarehouseName(savedUser.getWarehouse().getName());
        }
        if (savedUser.getDateOfBirth() != null) {
            agentDTO.setDateOfBirth(savedUser.getDateOfBirth());
        }
        agentDTO.setDateOfInsertion(savedUser.getDateOfInsertion());
        //String rolename = savedUser.getRoles().stream().findFirst().map(Role::getRoleName).orElse(null);
        // agentDTO.setRoleName(rolename);
        var jwtToken = jwtService.generateToken(user.build());
        var refreshToken = jwtService.generateRefreshToken(user.build());
        saveUserToken(savedUser, jwtToken);
        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .agent(savedUser)
                .build();
    }

    public boolean userExists(String email) {
        return agentRepo.existsByUsername(email);
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request, HttpServletResponse response) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );
        var user = agentRepo.findByUsername(request.getUsername());

        var jwtToken = jwtService.generateToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);
        revokeAllUserTokens(user);
        saveUserToken(user, jwtToken);
        addAccessTokenCookie(response, refreshToken);
        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .agent(user)
                .build();
    }

    public void addAccessTokenCookie(HttpServletResponse response, String token) {
        Cookie cookie = new Cookie("refreshToken", token);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(3600);
        response.addCookie(cookie);
    }

    private void saveUserToken(Agent user, String jwtToken) {
        Integer tokenid = mongo.generateSequence(SEQUENCE_NAME_TOKEN);
        var token = Token.builder()
                .id(tokenid)
                .agent(user)
                .token(jwtToken)
                .tokenType(TokenType.BEARER)
                .expired(false)
                .revoked(false)
                .build();

        tokenRepository.save(token);
    }

    private void revokeAllUserTokens(Agent user) {
        var validUserTokens = tokenRepository.findByAgentIdAndExpiredOrRevokedFalse(user.getId());
        if (validUserTokens.isEmpty())
            return;
        validUserTokens.forEach(token -> {
            token.setExpired(true);
            token.setRevoked(true);
        });
        tokenRepository.saveAll(validUserTokens);
    }

    public void refreshToken(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {
        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        final String refreshToken;
        final String userEmail;
        if (authHeader == null || !authHeader.startsWith("Bearer")) {
            return;
        }
        refreshToken = authHeader.substring(7);
        userEmail = jwtService.extractUsername(refreshToken);
        if (userEmail != null) {
            var user = this.agentRepo.findByUsername(userEmail);

            if (jwtService.isTokenValid(refreshToken, user)) {
                var accessToken = jwtService.generateToken(user);
                revokeAllUserTokens(user);
                saveUserToken(user, accessToken);
                var authResponse = AuthenticationResponse.builder()
                        .accessToken(accessToken)
                        .refreshToken(refreshToken)
                        .build();
                new ObjectMapper().writeValue(response.getOutputStream(), authResponse);
            }
        }
    }



}
