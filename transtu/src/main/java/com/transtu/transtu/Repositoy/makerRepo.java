package com.transtu.transtu.Repositoy;

import com.transtu.transtu.Document.CarBuilder;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface makerRepo extends MongoRepository<CarBuilder,String> {
    CarBuilder findByName(String name);
}
