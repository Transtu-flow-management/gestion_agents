package com.transtu.transtu.Repositoy;

import com.transtu.transtu.Document.Marque;
import com.transtu.transtu.Document.fabriquant;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BrandRepo extends MongoRepository<Marque,String> {
    boolean existsByName(String name);

    Marque findByFabriquant (String fabriquant);
    boolean existsByFabriquant(String fabriquant);

}
