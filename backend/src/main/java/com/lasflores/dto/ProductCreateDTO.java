package com.lasflores.dto;

import com.lasflores.entity.Categoria;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor @AllArgsConstructor
@Builder
public class ProductCreateDTO {

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    @NotBlank(message = "La marca es obligatoria")
    private String marca;

    @NotNull(message = "El precio es obligatorio")
    @DecimalMin(value = "0.01", message = "El precio debe ser mayor a 0")
    private BigDecimal precio;

    @NotNull(message = "La categoría es obligatoria")
    private Categoria categoria;

    @lombok.Builder.Default
    private Boolean enOferta = false;

    @lombok.Builder.Default
    private Boolean esEspecial = false;

    @Min(value = 0, message = "El descuento no puede ser negativo")
    @Max(value = 100, message = "El descuento no puede exceder 100%")
    @lombok.Builder.Default
    private Integer porcentajeDescuento = 0;

    private String descripcion;

    @NotNull(message = "El inventario es obligatorio")
    @Min(value = 0, message = "El inventario no puede ser negativo")
    private Integer numInventario;

    private String imagenUrl;
}
