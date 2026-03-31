package com.lasflores.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor @AllArgsConstructor
@Builder
public class VariantCreateDTO {

    @NotBlank(message = "El sabor es obligatorio")
    private String sabor;

    @NotBlank(message = "El SKU es obligatorio")
    private String sku;

    private BigDecimal precioExtra = BigDecimal.ZERO;

    @NotNull(message = "El inventario es obligatorio")
    @Min(value = 0)
    private Integer numInventario;
}
