package com.arunclinic;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {
    private final UserAccountRepository users;
    private final PasswordEncoder passwords;
    private final JwtEncoder jwt;
    public AuthService(UserAccountRepository users, PasswordEncoder passwords, JwtEncoder jwt) {
        this.users = users; this.passwords = passwords; this.jwt = jwt;
    }
    public AuthResponse register(RegisterRequest request) {
        String email = request.email().trim().toLowerCase();
        if (users.existsByEmailIgnoreCase(email)) throw new ResponseStatusException(HttpStatus.CONFLICT, "An account with that email already exists.");
        UserAccount patient = users.save(new UserAccount(request.name().trim(), email, request.phone().trim(), passwords.encode(request.password()), Role.PATIENT));
        return response(patient);
    }
    public AuthResponse login(LoginRequest request) {
        UserAccount user = users.findByEmailIgnoreCase(request.email().trim())
            .filter(account -> passwords.matches(request.password(), account.getPasswordHash()))
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email or password is incorrect."));
        return response(user);
    }
    private AuthResponse response(UserAccount user) {
        Instant now = Instant.now();
        JwtClaimsSet claims = JwtClaimsSet.builder().issuer("arun-homeo-clinic").issuedAt(now)
            .expiresAt(now.plus(Duration.ofHours(2))).subject(user.getEmail())
            .claim("roles", List.of(user.getRole().name())).build();
        String token = jwt.encode(JwtEncoderParameters.from(JwsHeader.with(MacAlgorithm.HS256).build(), claims)).getTokenValue();
        return new AuthResponse(token, AccountView.from(user));
    }
}

