package com.lasflores.controller;

import com.lasflores.config.SecurityConfig;
import com.lasflores.dto.AuthRequest;
import com.lasflores.dto.AuthResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final SecurityConfig.JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );

            String token = jwtUtil.generateToken(auth.getName());

            return ResponseEntity.ok(AuthResponse.builder()
                    .token(token)
                    .username(auth.getName())
                    .message("Login exitoso")
                    .build());
        } catch (org.springframework.security.core.AuthenticationException e) {
            e.printStackTrace();
            return ResponseEntity.status(401).body(java.util.Map.of(
                "error", "Unauthorized",
                "message", e.getMessage()
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(java.util.Map.of(
                "error", "Server Error",
                "message", e.getMessage()
            ));
        }
    }
}
