package com.transtu.transtu.Repositoy;

import com.transtu.transtu.Document.Path;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PathRepo extends MongoRepository<Path,String> {
    boolean existsByStartFr( String startFr);
    boolean existsByStartAr(String startAr);
    boolean existsByEndFr(String endFr);
    boolean existsByEndAr(String endAr);
}
