package io.squid.cynapse.configs;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * @author TopeEstLa
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private static final String[] PUBLIC_ENDPOINTS = {
            "/api/auth/sign-in",
            "/api/auth/sign-out",
            "/api/auth/sign-up"
    };

    @Autowired
    private JwtSecurityFilter jwtSecurityFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> {
                    session.sessionCreationPolicy(SessionCreationPolicy.STATELESS);
                })
                .authorizeHttpRequests(auth -> {
                    auth.requestMatchers(PUBLIC_ENDPOINTS).permitAll();
                    auth.anyRequest().authenticated();
                })
                .addFilterBefore(jwtSecurityFilter, UsernamePasswordAuthenticationFilter.class);


        return httpSecurity.build();
    }

    public static String[] getPublicEndpoints() {
        return PUBLIC_ENDPOINTS;
    }
}
