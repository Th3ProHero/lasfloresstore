package com.lasflores.repository;

import com.lasflores.entity.AppUser;
import com.lasflores.entity.Order;
import com.lasflores.entity.OrderStatus;
import com.lasflores.entity.OrderTipo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUserOrderByCreatedAtDesc(AppUser user);

    List<Order> findByTipoOrdenAndStatusAndFechaEvento(
            OrderTipo tipoOrden, OrderStatus status, LocalDate fechaEvento);

    // ─── Estadísticas ──────────────────────────────────────

    /** Total ventas y número de pedidos en un rango de fechas (excluye CANCELLED) */
    @Query("SELECT SUM(o.total), COUNT(o) FROM Order o " +
           "WHERE o.createdAt BETWEEN :inicio AND :fin " +
           "AND o.status != 'CANCELLED'")
    List<Object[]> findMonthlySummary(@Param("inicio") LocalDateTime inicio,
                                       @Param("fin") LocalDateTime fin);

    /** Top 5 productos por cantidad vendida */
    @Query("SELECT i.productName, SUM(i.cantidad), SUM(i.subtotal) " +
           "FROM OrderItem i JOIN i.order o " +
           "WHERE o.status != 'CANCELLED' " +
           "GROUP BY i.productName ORDER BY SUM(i.cantidad) DESC")
    List<Object[]> findTop5Products();

    /** Conteo de órdenes agrupado por status */
    @Query("SELECT o.status, COUNT(o) FROM Order o GROUP BY o.status")
    List<Object[]> countByStatus();
}
