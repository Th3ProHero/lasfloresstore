package com.lasflores.dto;

import com.lasflores.entity.MetodoPago;
import com.lasflores.entity.OrderStatus;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor @AllArgsConstructor
@Builder
public class CheckoutResponse {
    private Long orderId;
    private BigDecimal total;
    private MetodoPago metodoPago;
    private OrderStatus status;
    private String message;
    private LocalDateTime createdAt;
}
