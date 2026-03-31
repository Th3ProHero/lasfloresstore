package com.lasflores.service;

import com.lasflores.dto.*;
import com.lasflores.entity.*;
import com.lasflores.exception.InsufficientStockException;
import com.lasflores.exception.ResourceNotFoundException;
import com.lasflores.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
@Slf4j
public class CheckoutService {

    private final ProductRepository productRepository;
    private final ProductVariantRepository variantRepository;
    private final OrderRepository orderRepository;

    @Transactional
    public CheckoutResponse processCheckout(CheckoutRequest request) {
        Order order = Order.builder()
                .customerName(request.getCustomerName())
                .customerEmail(request.getCustomerEmail())
                .customerPhone(request.getCustomerPhone())
                .metodoPago(request.getMetodoPago())
                .status(OrderStatus.PENDING)
                .total(BigDecimal.ZERO)
                .notas(request.getNotas())
                .build();

        BigDecimal total = BigDecimal.ZERO;

        for (CartItemDTO cartItem : request.getItems()) {
            Product product = productRepository.findById(cartItem.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Producto no encontrado: " + cartItem.getProductId()));

            BigDecimal unitPrice;
            String variantSabor = null;
            Long variantId = null;

            if (cartItem.getVariantId() != null) {
                // Buying a specific variant
                ProductVariant variant = variantRepository.findById(cartItem.getVariantId())
                        .orElseThrow(() -> new ResourceNotFoundException(
                                "Variante no encontrada: " + cartItem.getVariantId()));

                // Validate variant stock atomically
                int updated = variantRepository.decrementStock(variant.getId(), cartItem.getCantidad());
                if (updated == 0) {
                    throw new InsufficientStockException(
                            "Stock insuficiente para " + product.getNombre() + " (" + variant.getSabor() + "). " +
                            "Disponible: " + variant.getNumInventario() + ", Solicitado: " + cartItem.getCantidad());
                }

                unitPrice = product.getPrecioFinal().add(variant.getPrecioExtra() != null ? variant.getPrecioExtra() : BigDecimal.ZERO);
                variantSabor = variant.getSabor();
                variantId = variant.getId();
            } else {
                // Buying the base product
                int updated = productRepository.decrementStock(product.getId(), cartItem.getCantidad());
                if (updated == 0) {
                    throw new InsufficientStockException(
                            "Stock insuficiente para " + product.getNombre() + ". " +
                            "Disponible: " + product.getNumInventario() + ", Solicitado: " + cartItem.getCantidad());
                }
                unitPrice = product.getPrecioFinal();
            }

            BigDecimal subtotal = unitPrice.multiply(BigDecimal.valueOf(cartItem.getCantidad()));
            total = total.add(subtotal);

            OrderItem orderItem = OrderItem.builder()
                    .productName(product.getNombre())
                    .productMarca(product.getMarca())
                    .variantSabor(variantSabor)
                    .cantidad(cartItem.getCantidad())
                    .precioUnitario(unitPrice)
                    .subtotal(subtotal)
                    .productId(product.getId())
                    .variantId(variantId)
                    .build();

            order.addItem(orderItem);
        }

        order.setTotal(total);

        // Payment processing placeholder
        switch (request.getMetodoPago()) {
            case SPEI:
                log.info("📧 SPEI payment placeholder - Order will be confirmed upon transfer verification");
                order.setStatus(OrderStatus.PENDING);
                break;
            case TARJETA:
                log.info("💳 Card payment placeholder - Integrate with payment gateway (e.g., Stripe, Conekta)");
                order.setStatus(OrderStatus.PENDING);
                break;
            case EFECTIVO:
                log.info("💵 Cash payment - Order confirmed, collect on delivery/pickup");
                order.setStatus(OrderStatus.CONFIRMED);
                break;
        }

        Order savedOrder = orderRepository.save(order);

        String message = switch (request.getMetodoPago()) {
            case SPEI -> "Orden creada. Realiza tu transferencia SPEI y envía el comprobante.";
            case TARJETA -> "Orden creada. Procesando pago con tarjeta (pendiente integración pasarela).";
            case EFECTIVO -> "Orden confirmada. Paga en efectivo al recoger tu pedido.";
        };

        return CheckoutResponse.builder()
                .orderId(savedOrder.getId())
                .total(savedOrder.getTotal())
                .metodoPago(savedOrder.getMetodoPago())
                .status(savedOrder.getStatus())
                .message(message)
                .createdAt(savedOrder.getCreatedAt())
                .build();
    }
}
