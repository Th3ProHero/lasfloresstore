package com.lasflores.service;

import com.lasflores.dto.OrderAdminDTO;
import com.lasflores.entity.Order;
import com.lasflores.entity.OrderStatus;
import com.lasflores.exception.ResourceNotFoundException;
import com.lasflores.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminOrderService {

    private final OrderRepository orderRepository;
    private final EmailService emailService;

    /** Statuses that cannot be changed once set */
    private static final Set<OrderStatus> LOCKED_STATUSES = Set.of(
            OrderStatus.DELIVERED, OrderStatus.COMPLETED, OrderStatus.CANCELLED
    );

    public List<OrderAdminDTO> getAllOrders() {
        // Orden descendente por fecha
        List<Order> orders = orderRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
        return orders.stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional
    public OrderAdminDTO updateOrderStatus(Long orderId, OrderStatus newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Orden no encontrada: " + orderId));

        if (LOCKED_STATUSES.contains(order.getStatus())) {
            throw new IllegalStateException(
                "El pedido " + order.getOrderNumber() + " ya está en estado " + order.getStatus() + " y no puede modificarse."
            );
        }

        order.setStatus(newStatus);
        Order updated = orderRepository.save(order);

        if (newStatus == OrderStatus.DELIVERED) {
            log.info("Pedido {} marcado como ENTREGADO — enviando confirmación.", order.getOrderNumber());
            emailService.sendDeliveryConfirmation(updated);
        }

        return toDTO(updated);
    }

    private OrderAdminDTO toDTO(Order order) {
        return OrderAdminDTO.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .customerName(order.getCustomerName())
                .customerEmail(order.getCustomerEmail())
                .customerPhone(order.getCustomerPhone())
                .metodoPago(order.getMetodoPago())
                .status(order.getStatus())
                .total(order.getTotal())
                .notas(order.getNotas())
                .tipoOrden(order.getTipoOrden())
                .fechaEvento(order.getFechaEvento())
                .cantidadPersonas(order.getCantidadPersonas())
                .createdAt(order.getCreatedAt())
                .items(order.getItems().stream().map(item ->
                        OrderAdminDTO.OrderItemDTO.builder()
                                .productName(item.getProductName())
                                .variantSabor(item.getVariantSabor())
                                .cantidad(item.getCantidad())
                                .unitPrice(item.getPrecioUnitario())
                                .subtotal(item.getSubtotal())
                                .build()
                ).collect(Collectors.toList()))
                .build();
    }
}
