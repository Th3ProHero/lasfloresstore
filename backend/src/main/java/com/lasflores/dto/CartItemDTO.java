package com.lasflores.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor @AllArgsConstructor
@Builder
public class CartItemDTO {

    @NotNull(message = "El ID del producto es obligatorio")
    private Long productId;

    private Long variantId; // nullable - only if buying a specific variant

    @NotNull(message = "La cantidad es obligatoria")
    @Min(value = 1, message = "La cantidad mínima es 1")
    private Integer cantidad;
}
