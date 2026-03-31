package com.lasflores.dto;

import lombok.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor @AllArgsConstructor
@Builder
public class VariantDTO {
    private Long id;
    private String sabor;
    private String sku;
    private BigDecimal precioExtra;
    private Integer numInventario;
}
