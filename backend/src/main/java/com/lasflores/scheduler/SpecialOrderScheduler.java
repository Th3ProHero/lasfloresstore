package com.lasflores.scheduler;

import com.lasflores.entity.Order;
import com.lasflores.entity.OrderStatus;
import com.lasflores.entity.OrderTipo;
import com.lasflores.repository.OrderRepository;
import com.lasflores.repository.ProductRepository;
import com.lasflores.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * Cancela automáticamente los pedidos especiales que no fueron confirmados
 * en la sucursal el día previo a su fecha de entrega.
 *
 * Regla: Si la fechaEvento - 1 día == hoy AND status == AWAITING_CONFIRMATION
 *        → cancelar y liberar stock.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class SpecialOrderScheduler {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final EmailService emailService;

    // Corre todos los días a las 9:00 AM (hora del servidor)
    @Scheduled(cron = "0 0 9 * * *")
    @Transactional
    public void cancelarPedidosEspecialesVencidos() {
        LocalDate manana = LocalDate.now().plusDays(1);

        List<Order> pedidosVencidos = orderRepository
                .findByTipoOrdenAndStatusAndFechaEvento(
                        OrderTipo.ESPECIAL,
                        OrderStatus.AWAITING_CONFIRMATION,
                        manana
                );

        if (pedidosVencidos.isEmpty()) {
            log.info("[Scheduler] No hay pedidos especiales vencidos hoy.");
            return;
        }

        log.warn("[Scheduler] Cancelando {} pedidos especiales no confirmados con evento mañana.", pedidosVencidos.size());

        for (Order order : pedidosVencidos) {
            // Liberar stock de cada artículo
            order.getItems().forEach(item -> {
                if (item.getProductId() != null) {
                    int updated = productRepository.incrementStock(item.getProductId(), item.getCantidad());
                    log.info("[Scheduler] Stock liberado: producto={}, cantidad={}, actualizado={}",
                            item.getProductId(), item.getCantidad(), updated);
                }
            });

            // Cancelar el pedido
            order.setStatus(OrderStatus.CANCELLED);
            orderRepository.save(order);

            // Notificar al cliente
            emailService.sendSpecialOrderCancelledEmail(order);

            log.warn("[Scheduler] Pedido {} cancelado automáticamente — evento era el {}.",
                    order.getOrderNumber(), order.getFechaEvento());
        }
    }
}
