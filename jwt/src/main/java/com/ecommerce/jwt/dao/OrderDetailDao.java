package com.ecommerce.jwt.dao;

import com.ecommerce.jwt.entity.OrderDetail;
import com.ecommerce.jwt.entity.User;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface OrderDetailDao extends CrudRepository<OrderDetail, Integer> {
    List<OrderDetail> findByUser(User user);

    List<OrderDetail> findByOrderStatus(String status);
}
