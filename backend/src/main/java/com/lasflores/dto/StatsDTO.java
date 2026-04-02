package com.lasflores.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
@Builder
public class StatsDTO {

    // Resumen mes actual
    private BigDecimal totalVentasMes;
    private Long totalPedidosMes;
    private BigDecimal promedioPorPedido;

    // Ventas por mes (últimos 6 meses) — clave: "2025-04", valor: total
    private List<MesStats> ventasPorMes;

    // Top 5 productos más vendidos
    private List<ProductoTop> topProductos;

    // Pedidos por status
    private Map<String, Long> pedidosPorStatus;

    @Data
    @Builder
    public static class MesStats {
        private String mes;        // "EN 2025"
        private BigDecimal total;
        private Long cantidad;
    }

    @Data
    @Builder
    public static class ProductoTop {
        private String nombre;
        private Long cantidadVendida;
        private BigDecimal totalGenerado;
    }
}
