package com.transtu.transtu.Repositoy;

import com.transtu.transtu.Document.CarBuilder;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface makerRepo extends MongoRepository<CarBuilder,String> {
    CarBuilder findByName(String name);
}
