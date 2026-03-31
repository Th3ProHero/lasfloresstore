package com.lasflores.repository;

import com.lasflores.entity.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PromotionRepository extends JpaRepository<Promotion, Long> {

    @Query("SELECT p FROM Promotion p LEFT JOIN FETCH p.product WHERE p.isActive = true AND p.endDate >= :now ORDER BY p.priority DESC, p.startDate DESC")
    List<Promotion> findActivePromotions(@Param("now") LocalDateTime now);

    @Query("SELECT p FROM Promotion p LEFT JOIN FETCH p.product ORDER BY p.priority DESC, p.id DESC")
    List<Promotion> findAllPromotionsWithProduct();

    @org.springframework.data.jpa.repository.Modifying
    @Query("UPDATE Promotion p SET p.clickCount = p.clickCount + 1 WHERE p.id = :id")
    void incrementClickCount(@Param("id") Long id);
}
