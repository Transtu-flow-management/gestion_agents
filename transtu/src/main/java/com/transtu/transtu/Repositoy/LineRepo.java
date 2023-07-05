package com.transtu.transtu.Repositoy;

import com.transtu.transtu.Document.Line;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface LineRepo extends MongoRepository<Line,String> {

    boolean existsByNameAr( String nameAr);
    boolean existsByNameFr(String nameFr);
}
