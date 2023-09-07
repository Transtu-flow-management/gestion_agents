package com.transtu.transtu.Repositoy;

import com.transtu.transtu.Document.Path;
import com.transtu.transtu.Document.Stop;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PathRepo extends MongoRepository<Path,String> {
    boolean existsByStartFr( String startFr);
    boolean existsByStartAr(String startAr);
    boolean existsByEndFr(String endFr);
    boolean existsByEndAr(String endAr);
    List<Path> findByStopsContaining(Stop stop);

}
