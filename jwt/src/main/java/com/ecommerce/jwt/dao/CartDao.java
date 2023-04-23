package com.ecommerce.jwt.dao;

import com.ecommerce.jwt.entity.Cart;
import com.ecommerce.jwt.entity.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CartDao extends CrudRepository<Cart, Integer> {
    List<Cart> findByUser(User user);
}
