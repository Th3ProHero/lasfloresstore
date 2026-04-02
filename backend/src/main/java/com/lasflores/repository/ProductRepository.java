package com.lasflores.repository;

import com.lasflores.entity.Categoria;
import com.lasflores.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // ─── Catalog (excluding special products) ────────────

    Page<Product> findByEsEspecialFalse(Pageable pageable);

    Page<Product> findByCategoria(Categoria categoria, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.esEspecial = false AND " +
           "p.categoria = :categoria AND " +
           "LOWER(p.marca) LIKE LOWER(CONCAT('%', :marca, '%')) AND " +
           "LOWER(p.nombre) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Product> findByFiltersWithCategoria(
        @Param("categoria") Categoria categoria,
        @Param("marca") String marca,
        @Param("search") String search,
        Pageable pageable
    );

    @Query("SELECT p FROM Product p WHERE p.esEspecial = false AND " +
           "LOWER(p.marca) LIKE LOWER(CONCAT('%', :marca, '%')) AND " +
           "LOWER(p.nombre) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Product> findByFiltersAllCategorias(
        @Param("marca") String marca,
        @Param("search") String search,
        Pageable pageable
    );

    Page<Product> findByEnOfertaTrueAndEsEspecialFalse(Pageable pageable);

    // ─── Special products ─────────────────────────────────

    Page<Product> findByEsEspecialTrue(Pageable pageable);

    // ─── Stock & misc ─────────────────────────────────────

    @Query("SELECT p FROM Product p WHERE p.numInventario < :threshold")
    List<Product> findLowStockProducts(@Param("threshold") int threshold);

    @Query("SELECT DISTINCT p.marca FROM Product p ORDER BY p.marca")
    List<String> findAllMarcas();

    @Modifying
    @Query("UPDATE Product p SET p.numInventario = p.numInventario - :qty WHERE p.id = :id AND p.numInventario >= :qty")
    int decrementStock(@Param("id") Long id, @Param("qty") int qty);

    @Modifying
    @Query("UPDATE Product p SET p.numInventario = p.numInventario + :qty WHERE p.id = :id")
    int incrementStock(@Param("id") Long id, @Param("qty") int qty);
}
