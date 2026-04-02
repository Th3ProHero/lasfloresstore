package com.lasflores.dto;

import com.lasflores.entity.MetodoPago;
import com.lasflores.entity.OrderTipo;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor @AllArgsConstructor
@Builder
public class CheckoutRequest {

    @NotNull(message = "Debes iniciar sesión para realizar un pedido")
    private Long userId;

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

    // ─── Special order fields (optional) ───
    @Builder.Default
    private OrderTipo tipoOrden = OrderTipo.REGULAR;

    private LocalDate fechaEvento;   // Fecha para la cual se necesita el pedido

    private Integer cantidadPersonas; // Estimado de personas para el evento
}
