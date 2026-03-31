package com.lasflores.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "product_variants")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class ProductVariant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String sabor;

    @Column(nullable = false, unique = true)
    private String sku;

    @Column(name = "precio_extra", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal precioExtra = BigDecimal.ZERO;

    @Column(name = "num_inventario", nullable = false)
    @Builder.Default
    private Integer numInventario = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;
}
