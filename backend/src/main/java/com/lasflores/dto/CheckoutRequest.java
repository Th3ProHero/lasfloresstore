package com.lasflores.dto;

import com.lasflores.entity.MetodoPago;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor @AllArgsConstructor
@Builder
public class CheckoutRequest {

    @NotBlank(message = "El nombre del cliente es obligatorio")
    private String customerName;

    private String customerEmail;

    private String customerPhone;

    @NotNull(message = "El método de pago es obligatorio")
    private MetodoPago metodoPago;

    @NotEmpty(message = "El carrito no puede estar vacío")
    @Valid
    private List<CartItemDTO> items;

    private String notas;
}
