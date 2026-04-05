package io.squid.cynapse.configs;

import io.squid.cynapse.entities.User;
import io.squid.cynapse.enums.Cookies;
import io.squid.cynapse.repositories.UserRepository;
import io.squid.cynapse.services.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

/**
 * @author TopeEstLa
 */
@Component
public class JwtSecurityFilter extends OncePerRequestFilter {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String path = request.getRequestURI();
        if (Arrays.asList(SecurityConfig.getPublicEndpoints()).contains(path)) {
            filterChain.doFilter(request, response);
            return;
        }

        if (request.getCookies() == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        String accessToken = findAccessToken(request.getCookies());
        if (accessToken == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        String username = this.jwtService.getUsernameFromToken(accessToken);
        if (username == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        Optional<User> userOpt = this.userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        User user = userOpt.get();


        Authentication auth = new UsernamePasswordAuthenticationToken(user, null, List.of(new SimpleGrantedAuthority(user.getRole().toString())));
        SecurityContextHolder.getContext().setAuthentication(auth); //tadam
    }

    public String findAccessToken(Cookie[] cookies) {
        for (Cookie cookie : cookies) {
            if (cookie.getName().equals(Cookies.ACCESS_TOKEN.getCookieName())) {
                return cookie.getValue();
            }
        }
        return null;
    }
}
