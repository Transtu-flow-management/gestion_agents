package com.transtu.transtu.Auth;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.transtu.transtu.DTO.AgentDTO;
import com.transtu.transtu.Document.Agent;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthenticationResponse{
    @JsonProperty("access_token")
    private String accessToken;
    @JsonProperty("refresh_token")
    private String refreshToken;
    @JsonProperty("agent")
    private AgentDTO agent;


}
