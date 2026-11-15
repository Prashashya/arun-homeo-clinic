package com.arunclinic;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;
@Entity @Table(name = "user_accounts", uniqueConstraints = @UniqueConstraint(columnNames = "email"))
public class UserAccount {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
    @Column(nullable = false, length = 80) private String name;
    @Column(nullable = false, length = 160, unique = true) private String email;
    @Column(nullable = false, length = 24) private String phone;
    @Column(nullable = false, length = 100) private String passwordHash;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 16) private Role role;
    @Column(nullable = false, updatable = false) private Instant createdAt;
    protected UserAccount() {}
    public UserAccount(String name, String email, String phone, String passwordHash, Role role) {
        this.name=name; this.email=email; this.phone=phone; this.passwordHash=passwordHash; this.role=role;
    }
    @PrePersist void onCreate() { if (createdAt == null) createdAt = Instant.now(); }
    public UUID getId(){return id;} public String getName(){return name;} public String getEmail(){return email;}
    public String getPhone(){return phone;} public String getPasswordHash(){return passwordHash;} public Role getRole(){return role;}
}

