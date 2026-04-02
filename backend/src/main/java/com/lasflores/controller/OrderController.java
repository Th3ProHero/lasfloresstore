package com.lasflores.controller;

import com.lasflores.entity.AppUser;
import com.lasflores.entity.Order;
import com.lasflores.entity.OrderStatus;
import com.lasflores.exception.ResourceNotFoundException;
import com.lasflores.repository.OrderRepository;
import com.lasflores.repository.UserRepository;
import com.lasflores.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    private static final Set<OrderStatus> CANCELLABLE = Set.of(
            OrderStatus.PENDING, OrderStatus.AWAITING_CONFIRMATION
    );

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Order>> getUserOrders(@PathVariable Long userId) {
        AppUser user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado: " + userId));
        List<Order> orders = orderRepository.findByUserOrderByCreatedAtDesc(user);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<Order> getOrderDetails(@PathVariable Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Orden no encontrada: " + orderId));
        return ResponseEntity.ok(order);
    }

    /**
     * Cancels an order if:
     * - belongs to the requesting user
     * - status is PENDING or AWAITING_CONFIRMATION
     * - less than 1 hour since creation
     */
    @PostMapping("/{orderId}/cancel")
    public ResponseEntity<Map<String, String>> cancelOrder(
            @PathVariable Long orderId,
            @RequestParam Long userId) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Orden no encontrada: " + orderId));

        // Verify ownership
        if (order.getUser() == null || !order.getUser().getId().equals(userId)) {
            return ResponseEntity.status(403)
                    .body(Map.of("message", "No tienes permiso para cancelar este pedido."));
        }

        // Verify cancellable status
        if (!CANCELLABLE.contains(order.getStatus())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Este pedido ya no puede cancelarse (estado: " + order.getStatus() + ")."));
        }

        // Verify 1-hour window
        if (order.getCreatedAt() != null &&
                LocalDateTime.now().isAfter(order.getCreatedAt().plusHours(1))) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "El tiempo límite de cancelación (1 hora) ha vencido."));
        }

        order.setStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);

        emailService.sendOrderCancellationToUser(order);

        return ResponseEntity.ok(Map.of(
                "message", "Pedido " + order.getOrderNumber() + " cancelado correctamente."));
    }
}
