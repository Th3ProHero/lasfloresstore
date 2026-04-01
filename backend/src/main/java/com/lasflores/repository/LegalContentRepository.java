package com.lasflores.repository;

import com.lasflores.entity.LegalContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LegalContentRepository extends JpaRepository<LegalContent, Long> {
    
    // Spring Data JPA puede inferir "TopByOrderByVersionDesc"
    Optional<LegalContent> findTopByTypeOrderByVersionDesc(String type);
}
