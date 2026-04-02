package com.lasflores.service;

import com.lasflores.entity.AppUser;
import com.lasflores.entity.PasswordResetToken;
import com.lasflores.repository.PasswordResetTokenRepository;
import com.lasflores.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PasswordResetService {

    private final PasswordResetTokenRepository tokenRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.base-url:https://abarroteslasflores.com}")
    private String baseUrl;

    @Transactional
    public void sendResetEmail(String email) {
        // Always return success message even if email not found (security best practice)
        userRepository.findByCorreo(email).ifPresent(user -> {
            // Invalidate any previous tokens for this email
            tokenRepository.deleteByEmail(email);

            String token = UUID.randomUUID().toString();
            PasswordResetToken resetToken = PasswordResetToken.builder()
                    .token(token)
                    .email(email)
                    .expiresAt(LocalDateTime.now().plusHours(1))
                    .used(false)
                    .build();
            tokenRepository.save(resetToken);

            String resetUrl = baseUrl + "/reset-password?token=" + token;
            String displayName = (user.getNombre() != null && !user.getNombre().isBlank())
                    ? user.getNombre()
                    : user.getCorreo();
            emailService.sendPasswordResetEmail(displayName, email, resetUrl);
            log.info("Reset token generado para: {}", email);
        });
    }

    @Transactional
    public void resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Token inválido o expirado."));

        if (resetToken.getUsed()) {
            throw new IllegalArgumentException("Este enlace ya fue utilizado.");
        }
        if (LocalDateTime.now().isAfter(resetToken.getExpiresAt())) {
            tokenRepository.delete(resetToken);
            throw new IllegalArgumentException("El enlace ha expirado. Solicita uno nuevo.");
        }

        AppUser user = userRepository.findByCorreo(resetToken.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado."));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        resetToken.setUsed(true);
        tokenRepository.save(resetToken);
        log.info("Contraseña actualizada para: {}", resetToken.getEmail());
    }
}
