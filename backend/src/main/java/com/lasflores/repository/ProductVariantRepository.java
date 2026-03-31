package com.lasflores.repository;

import com.lasflores.entity.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {

    List<ProductVariant> findByProductId(Long productId);

    @Query("SELECT v FROM ProductVariant v WHERE v.numInventario < :threshold")
    List<ProductVariant> findLowStockVariants(@Param("threshold") int threshold);

    @Modifying
    @Query("UPDATE ProductVariant v SET v.numInventario = v.numInventario - :qty WHERE v.id = :id AND v.numInventario >= :qty")
    int decrementStock(@Param("id") Long id, @Param("qty") int qty);

    boolean existsBySku(String sku);
}
