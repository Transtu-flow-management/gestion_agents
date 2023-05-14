package com.transtu.transtu.Config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.scrypt.SCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

/*@EnableWebSecurity
@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor*/
@Configuration
public class AgentConfig {

    @Bean
    public SecurityFilterChain securityFilterChain (HttpSecurity http)throws Exception{
        http.csrf().disable().authorizeHttpRequests()
                .requestMatchers("api/**").permitAll()
        ;
        return http.build();
    }
}
