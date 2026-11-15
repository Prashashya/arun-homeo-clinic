package com.arunclinic;
import jakarta.validation.constraints.*;
record RegisterRequest(@NotBlank @Size(max=80) String name,
    @NotBlank @Email @Size(max=160) String email,
    @NotBlank @Pattern(regexp="[+]?[0-9 ()-]{7,20}") String phone,
    @NotBlank @Size(min=10,max=72) String password,
    @NotNull @AssertTrue Boolean consent) {}
record LoginRequest(@NotBlank @Email @Size(max=160) String email,@NotBlank @Size(max=72) String password) {}
record AccountView(String id,String name,String email,String phone,String role) {
    static AccountView from(UserAccount u){return new AccountView(u.getId().toString(),u.getName(),u.getEmail(),u.getPhone(),u.getRole().name());}
}
record AuthResponse(String token,AccountView user) {}

