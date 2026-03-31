package com.lasflores.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private String marca;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal precio;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Categoria categoria;

    @Column(name = "en_oferta")
    @Builder.Default
    private Boolean enOferta = false;

    @Column(name = "porcentaje_descuento")
    @Builder.Default
    private Integer porcentajeDescuento = 0;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "num_inventario", nullable = false)
    @Builder.Default
    private Integer numInventario = 0;

    @Column(name = "imagen_url", columnDefinition = "TEXT")
    private String imagenUrl;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<ProductVariant> variantes = new ArrayList<>();

    @Column(name = "created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Version
    private Long version;

    // Computed: precio final con descuento
    @Transient
    public BigDecimal getPrecioFinal() {
        if (Boolean.TRUE.equals(enOferta) && porcentajeDescuento != null && porcentajeDescuento > 0) {
            BigDecimal factor = BigDecimal.ONE.subtract(
                BigDecimal.valueOf(porcentajeDescuento).divide(BigDecimal.valueOf(100))
            );
            return precio.multiply(factor).setScale(2, java.math.RoundingMode.HALF_UP);
        }
        return precio;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Helper to add variant
    public void addVariant(ProductVariant variant) {
        variantes.add(variant);
        variant.setProduct(this);
    }

    public void removeVariant(ProductVariant variant) {
        variantes.remove(variant);
        variant.setProduct(null);
    }
}
