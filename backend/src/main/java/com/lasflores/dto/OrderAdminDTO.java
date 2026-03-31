package com.lasflores.dto;

import com.lasflores.entity.MetodoPago;
import com.lasflores.entity.OrderStatus;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class OrderAdminDTO {
    private Long id;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private MetodoPago metodoPago;
    private OrderStatus status;
    private BigDecimal total;
    private String notas;
    private LocalDateTime createdAt;
    private List<OrderItemDTO> items;

    @Data
    @Builder
    public static class OrderItemDTO {
        private String productName;
        private String variantSabor;
        private Integer cantidad;
        private BigDecimal unitPrice;
        private BigDecimal subtotal;
    }
}
