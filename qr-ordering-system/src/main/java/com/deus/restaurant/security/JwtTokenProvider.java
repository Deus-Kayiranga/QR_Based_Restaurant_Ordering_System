package com.deus.restaurant.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import java.util.Date;
import java.util.Map;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Component
public class JwtTokenProvider {

    private final SecretKey signingKey;
    private final long expirationMs;

    public JwtTokenProvider(
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.expiration-ms}") long expirationMs
    ) {
        byte[] keyBytes = Decoders.BASE64.decode(toBase64IfNeeded(secret));
        this.signingKey = Keys.hmacShaKeyFor(keyBytes);
        this.expirationMs = expirationMs;
    }

    public String generateToken(UserDetails userDetails, Map<String, Object> extraClaims) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + expirationMs);
        return Jwts.builder()
                .claims(extraClaims)
                .subject(userDetails.getUsername())
                .issuedAt(now)
                .expiration(expiry)
                .signWith(signingKey)
                .compact();
    }

    public String getUsernameFromToken(String token) {
        return getAllClaims(token).getSubject();
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        String username = getUsernameFromToken(token);
        return username != null && username.equalsIgnoreCase(userDetails.getUsername()) && !isTokenExpired(token);
    }

    public Claims getAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private boolean isTokenExpired(String token) {
        Date exp = getAllClaims(token).getExpiration();
        return exp == null || exp.before(new Date());
    }

    /**
     * JJWT expects base64 secret bytes for Keys.hmacShaKeyFor.
     * If user provided a raw text secret, we base64-encode it.
     */
    private static String toBase64IfNeeded(String secret) {
        if (secret == null) return "";
        String trimmed = secret.trim();
        if (trimmed.isEmpty()) return "";
        // heuristic: base64 strings typically end with '=' and are alnum+/; if not, encode.
        boolean looksBase64 = trimmed.matches("^[A-Za-z0-9+/=]+$") && trimmed.length() % 4 == 0;
        if (looksBase64) return trimmed;
        return java.util.Base64.getEncoder().encodeToString(trimmed.getBytes(java.nio.charset.StandardCharsets.UTF_8));
    }
}

