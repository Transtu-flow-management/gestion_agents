package com.transtu.transtu.Repositoy;

import com.transtu.transtu.Document.Warehouse;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface entropotRepo extends MongoRepository<Warehouse, Integer> {
    boolean existsByName(String name);
}
