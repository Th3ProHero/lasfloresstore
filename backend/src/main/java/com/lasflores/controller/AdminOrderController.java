package com.lasflores.controller;

import com.lasflores.dto.OrderAdminDTO;
import com.lasflores.entity.OrderStatus;
import com.lasflores.service.AdminOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
public class AdminOrderController {

    private final AdminOrderService adminOrderService;

    @GetMapping
    public ResponseEntity<List<OrderAdminDTO>> getAllOrders() {
        return ResponseEntity.ok(adminOrderService.getAllOrders());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<OrderAdminDTO> updateOrderStatus(
            @PathVariable Long id, 
            @RequestParam OrderStatus status) {
        return ResponseEntity.ok(adminOrderService.updateOrderStatus(id, status));
    }
}
