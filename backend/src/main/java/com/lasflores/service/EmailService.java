package com.lasflores.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import com.lasflores.entity.Order;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender emailSender;
    private final TemplateEngine templateEngine;

    @Value("${app.admin.email:bautista.flores.mauricio2@gmail.com}")
    private String adminEmail;

    @Async
    public void sendOrderConfirmationToUser(Order order) {
        if (order.getCustomerEmail() == null || order.getCustomerEmail().isBlank()) {
            log.warn("El cliente de la orden {} no tiene correo registrado", order.getOrderNumber());
            return;
        }
        
        try {
            Context context = new Context();
            context.setVariable("order", order);
            context.setVariable("title", "Confirmación de Pedido - " + order.getOrderNumber());
            context.setVariable("isAdmin", false);
            
            String process = templateEngine.process("order-email", context);
            
            sendHtmlEmail(order.getCustomerEmail(), "Confirmación de Pedido - Las Flores", process);
            log.info("Email de confirmación enviado al usuario: {}", order.getCustomerEmail());
        } catch (Exception e) {
            log.error("Error al enviar email al usuario: {}", e.getMessage());
        }
    }

    @Async
    public void sendOrderNotificationToAdmin(Order order) {
        try {
            Context context = new Context();
            context.setVariable("order", order);
            context.setVariable("title", "Nuevo Pedido Recibido - " + order.getOrderNumber());
            context.setVariable("isAdmin", true);
            
            String process = templateEngine.process("order-email", context);
            
            sendHtmlEmail(adminEmail, "Nuevo Pedido: " + order.getOrderNumber() + " - Las Flores", process);
            log.info("Email de notificación enviado al admin: {}", adminEmail);
        } catch (Exception e) {
            log.error("Error al enviar email al admin: {}", e.getMessage());
        }
    }

    @Async
    public void sendSpecialOrderConfirmationToUser(Order order) {
        if (order.getCustomerEmail() == null || order.getCustomerEmail().isBlank()) {
            log.warn("Pedido especial {} sin correo de cliente", order.getOrderNumber());
            return;
        }
        try {
            Context context = new Context();
            context.setVariable("order", order);
            context.setVariable("title", "Solicitud de Pedido Especial - " + order.getOrderNumber());
            context.setVariable("isAdmin", false);

            String process = templateEngine.process("special-order-email", context);
            sendHtmlEmail(order.getCustomerEmail(), "Solicitud de Pedido Especial " + order.getOrderNumber() + " - Las Flores", process);
            log.info("Email especial enviado al usuario: {}", order.getCustomerEmail());
        } catch (Exception e) {
            log.error("Error al enviar email especial al usuario: {}", e.getMessage());
        }
    }

    @Async
    public void sendSpecialOrderNotificationToAdmin(Order order) {
        try {
            Context context = new Context();
            context.setVariable("order", order);
            context.setVariable("title", "Nueva Solicitud Especial - " + order.getOrderNumber());
            context.setVariable("isAdmin", true);

            String process = templateEngine.process("special-order-email", context);
            sendHtmlEmail(adminEmail, "⭐ Pedido Especial: " + order.getOrderNumber() + " - Las Flores", process);
            log.info("Email especial enviado al admin: {}", adminEmail);
        } catch (Exception e) {
            log.error("Error al enviar email especial al admin: {}", e.getMessage());
        }
    }

    @Async
    public void sendSpecialOrderCancelledEmail(Order order) {
        if (order.getCustomerEmail() == null || order.getCustomerEmail().isBlank()) return;
        try {
            Context context = new Context();
            context.setVariable("order", order);
            String process = templateEngine.process("special-order-cancelled-email", context);
            sendHtmlEmail(order.getCustomerEmail(),
                    "Pedido Especial Cancelado: " + order.getOrderNumber() + " - Las Flores", process);
            log.info("Email de cancelación enviado a {}", order.getCustomerEmail());
        } catch (Exception e) {
            log.error("Error al enviar email de cancelación: {}", e.getMessage());
        }
    }

    @Async
    public void sendDeliveryConfirmation(Order order) {
        if (order.getCustomerEmail() == null || order.getCustomerEmail().isBlank()) return;
        try {
            Context context = new Context();
            context.setVariable("order", order);
            context.setVariable("title", "Tu pedido fue entregado - " + order.getOrderNumber());
            String process = templateEngine.process("delivery-confirmation-email", context);
            sendHtmlEmail(order.getCustomerEmail(),
                    "✅ Pedido Entregado: " + order.getOrderNumber() + " - Las Flores", process);
            log.info("Email de entrega enviado a {}", order.getCustomerEmail());
        } catch (Exception e) {
            log.error("Error al enviar email de entrega: {}", e.getMessage());
        }
    }

    @Async
    public void sendPasswordResetEmail(String nombre, String email, String resetUrl) {
        try {
            Context context = new Context();
            context.setVariable("nombre", nombre);
            context.setVariable("resetUrl", resetUrl);
            context.setVariable("title", "Recupera tu contraseña - Las Flores");
            String process = templateEngine.process("forgot-password-email", context);
            sendHtmlEmail(email, "🔑 Recupera tu contraseña - Las Flores", process);
            log.info("Email de reset enviado a {}", email);
        } catch (Exception e) {
            log.error("Error al enviar email de reset: {}", e.getMessage());
        }
    }

    @Async
    public void sendOrderCancellationToUser(Order order) {
        if (order.getCustomerEmail() == null || order.getCustomerEmail().isBlank()) return;
        try {
            Context context = new Context();
            context.setVariable("order", order);
            context.setVariable("title", "Pedido cancelado - " + order.getOrderNumber());
            String process = templateEngine.process("order-cancellation-user-email", context);
            sendHtmlEmail(order.getCustomerEmail(),
                    "❌ Pedido Cancelado: " + order.getOrderNumber() + " - Las Flores", process);
            log.info("Email de cancelación enviado a {}", order.getCustomerEmail());
        } catch (Exception e) {
            log.error("Error al enviar email de cancelación al usuario: {}", e.getMessage());
        }
    }

    private void sendHtmlEmail(String to, String subject, String htmlBody) throws MessagingException {
        MimeMessage message = emailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlBody, true);
        
        emailSender.send(message);
    }
}
