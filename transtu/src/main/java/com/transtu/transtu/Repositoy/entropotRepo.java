package com.transtu.transtu.Repositoy;

import com.transtu.transtu.Document.Depots;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface entropotRepo extends MongoRepository<Depots, Integer> {
    boolean existsByName(String name);
}
