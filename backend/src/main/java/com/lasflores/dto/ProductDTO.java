package com.lasflores.dto;

import com.lasflores.entity.Categoria;
import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor @AllArgsConstructor
@Builder
public class ProductDTO {
    private Long id;
    private String codigo;
    private String nombre;
    private String marca;
    private BigDecimal precio;
    private BigDecimal precioFinal;
    private Categoria categoria;
    private Boolean enOferta;
    private Boolean esEspecial;
    private Integer porcentajeDescuento;
    private String descripcion;
    private Integer numInventario;
    private String imagenUrl;
    private List<VariantDTO> variantes;
}
