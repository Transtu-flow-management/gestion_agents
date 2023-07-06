package com.transtu.transtu.Repositoy;

import com.transtu.transtu.Document.Path;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PathRepo extends MongoRepository<Path,String> {
    boolean existsByNameAr( String nameAr);
    boolean existsByNameFr(String nameFr);
}
