package com.lasflores.service;

import com.lasflores.entity.AppUser;
import com.lasflores.exception.ResourceNotFoundException;
import com.lasflores.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    @Transactional
    public AppUser updateProfile(Long userId, String nombre, String email, String phone) {
        AppUser user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado: " + userId));
        
        if (nombre != null && !nombre.isBlank()) {
            user.setNombre(nombre);
        }

        if (email != null && !email.isBlank()) {
            // Check if email already taken by another user
            userRepository.findByCorreo(email).ifPresent(other -> {
                if (!other.getId().equals(userId)) {
                    throw new RuntimeException("El correo ya está en uso por otra cuenta");
                }
            });
            user.setCorreo(email);
        }
        
        user.setCelular(phone); // Puede ser null (opcional)
        
        return userRepository.save(user);
    }
}
