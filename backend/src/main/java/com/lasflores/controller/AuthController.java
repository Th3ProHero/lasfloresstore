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
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> register(@jakarta.validation.Valid @RequestBody com.lasflores.dto.RegisterRequest request) {
        if (userRepository.findByCorreo(request.getCorreo()).isPresent()) {
            return ResponseEntity.status(409).body(java.util.Map.of("error", "El correo ya está registrado"));
        }

        if (!request.getPassword().equals(request.getConfirmPassword())) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", "Las contraseñas no coinciden"));
        }

        com.lasflores.entity.AppUser user = com.lasflores.entity.AppUser.builder()
                .nombre(request.getNombre())
                .correo(request.getCorreo())
                .password(passwordEncoder.encode(request.getPassword()))
                .celular(request.getCelular())
                .rol(com.lasflores.entity.Role.USER)
                .build();

        userRepository.save(user);

        return ResponseEntity.ok(java.util.Map.of("message", "Usuario registrado exitosamente"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );

            com.lasflores.entity.AppUser user = userRepository.findByCorreo(auth.getName())
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado tras autenticación"));

            String token = jwtUtil.generateToken(auth.getName());

            return ResponseEntity.ok(AuthResponse.builder()
                    .token(token)
                    .userId(user.getId())
                    .username(user.getNombre())
                    .role(user.getRol().name())
                    .correo(user.getCorreo())
                    .celular(user.getCelular() != null ? user.getCelular() : "")
                    .message("Login exitoso")
                    .build());
        } catch (org.springframework.security.core.AuthenticationException e) {
            return ResponseEntity.status(401).body(java.util.Map.of("error", "Credenciales inválidas"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(java.util.Map.of("error", "Error interno del servidor"));
        }
    }
}
