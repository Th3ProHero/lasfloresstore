package com.lasflores.service;

import com.lasflores.dto.StatsDTO;
import com.lasflores.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminStatsService {

    private final OrderRepository orderRepository;

    private static final Map<Integer, String> MES_ABREV = Map.ofEntries(
        Map.entry(1, "EN"), Map.entry(2, "FE"), Map.entry(3, "MA"),
        Map.entry(4, "AB"), Map.entry(5, "MY"), Map.entry(6, "JN"),
        Map.entry(7, "JL"), Map.entry(8, "AG"), Map.entry(9, "SE"),
        Map.entry(10, "OC"), Map.entry(11, "NO"), Map.entry(12, "DC")
    );

    public StatsDTO getStats() {
        LocalDate now = LocalDate.now();
        LocalDateTime startOfMonth = now.withDayOfMonth(1).atStartOfDay();
        LocalDateTime endOfMonth = now.atTime(23, 59, 59);

        // --- Mes actual ---
        List<Object[]> mesRaw = orderRepository.findMonthlySummary(startOfMonth, endOfMonth);
        BigDecimal totalMes = BigDecimal.ZERO;
        long pedidosMes = 0;
        if (!mesRaw.isEmpty()) {
            Object[] row = mesRaw.get(0);
            totalMes = row[0] != null ? (BigDecimal) row[0] : BigDecimal.ZERO;
            pedidosMes = row[1] != null ? ((Number) row[1]).longValue() : 0;
        }
        BigDecimal promedio = pedidosMes > 0
                ? totalMes.divide(BigDecimal.valueOf(pedidosMes), 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        // --- Últimos 6 meses ---
        List<StatsDTO.MesStats> ventasPorMes = new ArrayList<>();
        for (int i = 5; i >= 0; i--) {
            LocalDate mes = now.minusMonths(i);
            LocalDateTime ini = mes.withDayOfMonth(1).atStartOfDay();
            LocalDateTime fin = mes.withDayOfMonth(mes.lengthOfMonth()).atTime(23, 59, 59);

            List<Object[]> raw = orderRepository.findMonthlySummary(ini, fin);
            BigDecimal tot = BigDecimal.ZERO;
            long cnt = 0;
            if (!raw.isEmpty() && raw.get(0)[0] != null) {
                tot = (BigDecimal) raw.get(0)[0];
                cnt = ((Number) raw.get(0)[1]).longValue();
            }

            String label = MES_ABREV.getOrDefault(mes.getMonthValue(), "??") + " " + mes.getYear();
            ventasPorMes.add(StatsDTO.MesStats.builder().mes(label).total(tot).cantidad(cnt).build());
        }

        // --- Top 5 productos ---
        List<Object[]> topRaw = orderRepository.findTop5Products();
        List<StatsDTO.ProductoTop> topProductos = topRaw.stream()
                .limit(5)
                .map(r -> StatsDTO.ProductoTop.builder()
                        .nombre((String) r[0])
                        .cantidadVendida(((Number) r[1]).longValue())
                        .totalGenerado(r[2] != null ? (BigDecimal) r[2] : BigDecimal.ZERO)
                        .build())
                .collect(Collectors.toList());

        // --- Por status ---
        List<Object[]> statusRaw = orderRepository.countByStatus();
        Map<String, Long> porStatus = new LinkedHashMap<>();
        for (Object[] row : statusRaw) {
            porStatus.put(row[0].toString(), ((Number) row[1]).longValue());
        }

        return StatsDTO.builder()
                .totalVentasMes(totalMes)
                .totalPedidosMes(pedidosMes)
                .promedioPorPedido(promedio)
                .ventasPorMes(ventasPorMes)
                .topProductos(topProductos)
                .pedidosPorStatus(porStatus)
                .build();
    }
}
