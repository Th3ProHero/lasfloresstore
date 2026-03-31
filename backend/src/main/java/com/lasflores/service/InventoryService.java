package com.lasflores.service;

import com.lasflores.dto.StockAlertDTO;
import com.lasflores.entity.Product;
import com.lasflores.entity.ProductVariant;
import com.lasflores.exception.ResourceNotFoundException;
import com.lasflores.repository.ProductRepository;
import com.lasflores.repository.ProductVariantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final ProductRepository productRepository;
    private final ProductVariantRepository variantRepository;

    @Value("${app.inventory.low-stock-threshold:10}")
    private int lowStockThreshold;

    /**
     * Get all products and variants with stock below the threshold
     */
    public List<StockAlertDTO> getLowStockAlerts() {
        List<StockAlertDTO> alerts = new ArrayList<>();

        // Check products
        List<Product> lowStockProducts = productRepository.findLowStockProducts(lowStockThreshold);
        for (Product p : lowStockProducts) {
            alerts.add(StockAlertDTO.builder()
                    .id(p.getId())
                    .nombre(p.getNombre())
                    .marca(p.getMarca())
                    .categoria(p.getCategoria().name())
                    .numInventario(p.getNumInventario())
                    .threshold(lowStockThreshold)
                    .tipo("PRODUCT")
                    .build());
        }

        // Check variants
        List<ProductVariant> lowStockVariants = variantRepository.findLowStockVariants(lowStockThreshold);
        for (ProductVariant v : lowStockVariants) {
            alerts.add(StockAlertDTO.builder()
                    .id(v.getId())
                    .nombre(v.getProduct().getNombre())
                    .marca(v.getProduct().getMarca())
                    .categoria(v.getProduct().getCategoria().name())
                    .numInventario(v.getNumInventario())
                    .threshold(lowStockThreshold)
                    .tipo("VARIANT")
                    .sabor(v.getSabor())
                    .sku(v.getSku())
                    .build());
        }

        return alerts;
    }

    /**
     * Adjust inventory for a product (positive = add, negative = subtract)
     */
    @Transactional
    public void adjustProductStock(Long productId, int adjustment) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con ID: " + productId));

        int newStock = product.getNumInventario() + adjustment;
        if (newStock < 0) {
            throw new IllegalArgumentException("El inventario no puede ser negativo. Stock actual: " + product.getNumInventario());
        }
        product.setNumInventario(newStock);
        productRepository.save(product);
    }

    /**
     * Adjust inventory for a variant
     */
    @Transactional
    public void adjustVariantStock(Long variantId, int adjustment) {
        ProductVariant variant = variantRepository.findById(variantId)
                .orElseThrow(() -> new ResourceNotFoundException("Variante no encontrada con ID: " + variantId));

        int newStock = variant.getNumInventario() + adjustment;
        if (newStock < 0) {
            throw new IllegalArgumentException("El inventario no puede ser negativo. Stock actual: " + variant.getNumInventario());
        }
        variant.setNumInventario(newStock);
        variantRepository.save(variant);
    }

    public int getThreshold() {
        return lowStockThreshold;
    }
}
