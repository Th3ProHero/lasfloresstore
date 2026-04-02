package com.lasflores.entity;

public enum OrderStatus {
    PENDING,
    AWAITING_CONFIRMATION, // Pedido especial: en espera de confirmar y pagar en sucursal
    CONFIRMED,
    PROCESSING,
    DELIVERED,
    COMPLETED,
    CANCELLED
}
