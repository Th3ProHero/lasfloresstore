package com.lasflores.controller;

import com.lasflores.entity.AppUser;
import com.lasflores.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PutMapping("/{userId}/profile")
    public ResponseEntity<?> updateProfile(@PathVariable Long userId, @RequestBody Map<String, String> request) {
        try {
            AppUser updated = userService.updateProfile(userId, request.get("correo"), request.get("celular"));
            return ResponseEntity.ok(Map.of(
                "message", "Perfil actualizado con éxito",
                "correo", updated.getCorreo(),
                "celular", updated.getCelular() != null ? updated.getCelular() : ""
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
