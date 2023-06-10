package com.transtu.transtu.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.transtu.transtu.Auth.AuthenticationRequest;
import com.transtu.transtu.Auth.AuthenticationResponse;
import com.transtu.transtu.DTO.AgentDTO;
import com.transtu.transtu.DTO.SignUpRequest;
import com.transtu.transtu.Document.Agent;
import com.transtu.transtu.Document.Role;
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

import java.io.IOException;
import java.util.Date;

import static com.transtu.transtu.Document.Agent.SEQUENCE_NAME;
import static com.transtu.transtu.Document.Token.SEQUENCE_NAME_TOKEN;


@Service
@RequiredArgsConstructor
public class AuthenticationService {
    @Autowired
    private final AgentRepo agentRepo;
@Autowired
private final SequenceGeneratorService mongo;
    @Autowired
    private final TokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    @Autowired
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    public AuthenticationResponse register(Agent request) {
        Date currentDate = new Date();
        Integer signid = mongo.generateSequence(SEQUENCE_NAME);
        var user = Agent.builder().id(signid)
                .name((request.getName()))
                .prenom(request.getPrenom())
                .email(request.getEmail())
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                //.roles(request.getRoles())
                .dateOfInsertion(currentDate)
                .build();

        var savedUser = agentRepo.save(user);
        AgentDTO agentDTO = new AgentDTO();
        agentDTO.setId(savedUser.getId());
        agentDTO.setPrenom(savedUser.getPrenom());
        agentDTO.setName(savedUser.getName());
        agentDTO.setUsername(savedUser.getUsername());
        agentDTO.setEmail(savedUser.getEmail());
        agentDTO.setDateOfInsertion(savedUser.getDateOfInsertion());
        //String rolename = savedUser.getRoles().stream().findFirst().map(Role::getRoleName).orElse(null);
       // agentDTO.setRoleName(rolename);
        var jwtToken = jwtService.generateToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);
        saveUserToken(savedUser, jwtToken);
        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .agent(agentDTO)
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
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
        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .build();
    }

    private void saveUserToken(Agent user, String jwtToken) {
        Integer tokenid =mongo.generateSequence(SEQUENCE_NAME_TOKEN);
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
        if (authHeader == null ||!authHeader.startsWith("Bearer")) {
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
