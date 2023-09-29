package com.transtu.transtu.Repositoy;

import com.transtu.transtu.Document.Car;
import com.transtu.transtu.Document.Conductor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CarRepo extends MongoRepository<Car,String> {

    boolean existsByMatricule (String matricule);
    Page<Car> findBywarehouseId(Integer id, Pageable pageable);
}
