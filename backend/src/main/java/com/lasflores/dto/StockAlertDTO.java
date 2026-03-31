package com.lasflores.dto;

import lombok.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor @AllArgsConstructor
@Builder
public class StockAlertDTO {
    private Long id;
    private String nombre;
    private String marca;
    private String categoria;
    private Integer numInventario;
    private Integer threshold;
    private String tipo; // "PRODUCT" or "VARIANT"
    private String sabor; // only for variants
    private String sku;   // only for variants
}
