package com.transtu.transtu.Repositoy;

import com.transtu.transtu.Document.Brand;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BrandRepo extends MongoRepository<Brand,String> {
    boolean existsByName(String name);

    Brand findBymaker (String maker);
    boolean existsBymaker(String maker);

}
