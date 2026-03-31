package com.lasflores.config;

import com.lasflores.entity.AppUser;
import com.lasflores.entity.Role;
import com.lasflores.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class AdminSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            log.info("No users found in database. Seeding initial admin...");
            
            AppUser admin = AppUser.builder()
                    .nombre("Administrador Principal")
                    .correo("admin@lasflores.com")
                    .password(passwordEncoder.encode("lasflores2024"))
                    .rol(Role.ADMIN)
                    .build();
            
            userRepository.save(admin);
            log.info("Initial admin seeded => Email: admin@lasflores.com | Default Password: lasflores2024");
        } else {
            log.info("Users already exist in database. Skipping AdminSeeder.");
        }
    }
}
