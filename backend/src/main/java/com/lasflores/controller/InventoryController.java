package com.lasflores.controller;

import com.lasflores.dto.StockAlertDTO;
import com.lasflores.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;

    @GetMapping("/alerts")
    public ResponseEntity<Map<String, Object>> getLowStockAlerts() {
        List<StockAlertDTO> alerts = inventoryService.getLowStockAlerts();
        return ResponseEntity.ok(Map.of(
                "threshold", inventoryService.getThreshold(),
                "totalAlerts", alerts.size(),
                "alerts", alerts
        ));
    }

    @PatchMapping("/product/{id}/adjust")
    public ResponseEntity<Map<String, String>> adjustProductStock(
            @PathVariable Long id,
            @RequestParam int adjustment
    ) {
        inventoryService.adjustProductStock(id, adjustment);
        return ResponseEntity.ok(Map.of("message", "Inventario actualizado exitosamente"));
    }

    @PatchMapping("/variant/{id}/adjust")
    public ResponseEntity<Map<String, String>> adjustVariantStock(
            @PathVariable Long id,
            @RequestParam int adjustment
    ) {
        inventoryService.adjustVariantStock(id, adjustment);
        return ResponseEntity.ok(Map.of("message", "Inventario de variante actualizado exitosamente"));
    }
}
