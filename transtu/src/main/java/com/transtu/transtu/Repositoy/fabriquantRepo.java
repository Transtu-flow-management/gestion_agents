package com.transtu.transtu.Repositoy;

import com.transtu.transtu.Document.fabriquant;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface fabriquantRepo extends MongoRepository<fabriquant,String> {
    fabriquant findByName(String name);
}
