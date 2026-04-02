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
    private final UserRepository userRepository;
    private final EmailService emailService;

    @Transactional
    public CheckoutResponse processCheckout(CheckoutRequest request) {
        AppUser user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado: " + request.getUserId()));

        // Auto-fill customer email from user account if not provided
        String customerEmail = (request.getCustomerEmail() != null && !request.getCustomerEmail().isBlank())
                ? request.getCustomerEmail()
                : user.getCorreo();

        String customerName = (request.getCustomerName() != null && !request.getCustomerName().isBlank())
                ? request.getCustomerName()
                : user.getNombre();

        Order order = Order.builder()
                .user(user)
                .orderNumber("PENDING") // Will update after first save
                .customerName(customerName)
                .customerEmail(customerEmail)
                .customerPhone(request.getCustomerPhone())
                .metodoPago(request.getMetodoPago())
                .status(OrderStatus.PENDING)
                .total(BigDecimal.ZERO)
                .notas(request.getNotas())
                .build();

        log.info("Procesando checkout para usuario {} | email: {} | nombre: {}", user.getId(), customerEmail, customerName);

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
                log.info("📧 SPEI payment placeholder");
                order.setStatus(OrderStatus.PENDING);
                break;
            case TARJETA:
                log.info("💳 Card payment placeholder");
                order.setStatus(OrderStatus.PENDING);
                break;
            case EFECTIVO:
                log.info("💵 Cash payment confirmed");
                order.setStatus(OrderStatus.CONFIRMED);
                break;
        }

        // Save order to get ID
        Order savedOrder = orderRepository.save(order);
        
        // Generate and set order number: FLORES-0000 format
        String orderNumber = String.format("FLORES-%04d", savedOrder.getId());
        savedOrder.setOrderNumber(orderNumber);
        
        // Final save with order number
        savedOrder = orderRepository.save(savedOrder);

        // Send emails
        emailService.sendOrderConfirmationToUser(savedOrder);
        emailService.sendOrderNotificationToAdmin(savedOrder);

        String message = switch (request.getMetodoPago()) {
            case SPEI -> "Orden " + orderNumber + " creada. Realiza tu transferencia SPEI y envía el comprobante.";
            case TARJETA -> "Orden " + orderNumber + " creada. Procesando pago con tarjeta.";
            case EFECTIVO -> "Orden " + orderNumber + " confirmada. Paga en efectivo al recoger tu pedido.";
        };

        return CheckoutResponse.builder()
                .orderId(savedOrder.getId())
                .orderNumber(savedOrder.getOrderNumber())
                .total(savedOrder.getTotal())
                .metodoPago(savedOrder.getMetodoPago())
                .status(savedOrder.getStatus())
                .message(message)
                .createdAt(savedOrder.getCreatedAt())
                .build();
    }
}
