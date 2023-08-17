package com.transtu.transtu.Repositoy;

import com.transtu.transtu.Document.Car;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CarRepo extends MongoRepository<Car,String> {

    boolean existsByMatricule (String matricule);
}
