package com.arunclinic;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;
@Configuration
public class BootstrapAdmin {
    @Bean ApplicationRunner seedAdmin(UserAccountRepository users, PasswordEncoder encoder,
        @Value("${clinic.admin.email:}") String email, @Value("${clinic.admin.password:}") String password) {
        return args -> {
            if (email == null || email.isBlank() || password == null || password.length() < 12) return;
            String normalized = email.trim().toLowerCase();
            if (!users.existsByEmailIgnoreCase(normalized)) {
                users.save(new UserAccount("Clinic administrator", normalized, "Not provided", encoder.encode(password), Role.ADMIN));
            }
        };
    }
}

