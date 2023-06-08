package com.transtu.transtu.Repositoy;

import com.transtu.transtu.Document.Reseau;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ReseauRepo extends MongoRepository<Reseau,Integer> {
    boolean existsByName(String name);
}
