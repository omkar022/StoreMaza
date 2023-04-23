package com.ecommerce.jwt.dao;

import com.ecommerce.jwt.entity.Product;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductDao extends CrudRepository<Product, Integer> {
    List<Product> findAll(Pageable pageable);

    List<Product> findByProductNameContainingIgnoreCaseOrProductDescriptionContainingIgnoreCase(String Key1, String Key2, Pageable pageable);
}
