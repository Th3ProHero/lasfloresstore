package com.lasflores.repository;

import com.lasflores.entity.AppUser;
import com.lasflores.entity.Order;
import com.lasflores.entity.OrderStatus;
import com.lasflores.entity.OrderTipo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserOrderByCreatedAtDesc(AppUser user);

    List<Order> findByTipoOrdenAndStatusAndFechaEvento(
            OrderTipo tipoOrden, OrderStatus status, LocalDate fechaEvento);
}
