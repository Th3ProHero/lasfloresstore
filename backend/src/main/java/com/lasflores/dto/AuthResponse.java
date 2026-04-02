package com.lasflores.dto;

import lombok.*;

@Data
@NoArgsConstructor @AllArgsConstructor
@Builder
public class AuthResponse {
    private String token;
    private Long userId;
    private String username;
    private String role;
    private String correo;
    private String celular;
    private String message;
}
