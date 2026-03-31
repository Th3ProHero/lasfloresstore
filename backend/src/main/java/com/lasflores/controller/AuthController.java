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
    private final com.lasflores.repository.UserRepository userRepository;

    @org.springframework.web.bind.annotation.GetMapping("/debug")
    public ResponseEntity<?> debugUser(@org.springframework.web.bind.annotation.RequestParam String correo) {
        return userRepository.findByCorreo(correo)
            .map(u -> ResponseEntity.ok(java.util.Map.of(
                "existe", true,
                "correo_encontrado", u.getCorreo(),
                "rol", u.getRol().name(),
                "hash_guardado", u.getPassword(),
                "mensaje_ayuda", "Si el hash coincide, el PasswordEncoder está fallando. Si no coincide, usaste otra contraseña. Si no existe, el admin no se guardó."
            )))
            .orElse(ResponseEntity.ok(java.util.Map.of("existe", false, "error", "Usuario no encontrado en la DB")));
    }

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
