package com.lasflores;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class LasFloresApplication {
    public static void main(String[] args) {
        SpringApplication.run(LasFloresApplication.class, args);
    }
}
