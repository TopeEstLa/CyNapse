package io.squid.cynapse.services;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

/**
 * @author TopeEstLa
 */
@Service
public class JwtService {

    private final SecretKey secretKey;

    private final long accessExpiryMinutes;

    public JwtService(@Value("${jwt.secret-key}") String secretKey, @Value("${jwt.access-token-expiration-time:15}") long accessExpiryMinutes) {
        byte[] keyBytes = secretKey.getBytes();
        if (keyBytes.length < 32) {
            throw new IllegalArgumentException("The secret key must be at least 256 bits (32 bytes) long for HS256 algorithm.");
        }

        this.secretKey = Keys.hmacShaKeyFor(keyBytes);
        this.accessExpiryMinutes = accessExpiryMinutes;
    }

    public String buildToken(String username) {
        return Jwts.builder()
                .subject(username)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + getAccessExpirySeconds() * 1000))
                .signWith(secretKey)
                .compact();
    }

    public String getUsernameFromToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();

        return claims.getSubject();
    }

    public long getAccessExpirySeconds() {
        return accessExpiryMinutes * 60;
    }
}
