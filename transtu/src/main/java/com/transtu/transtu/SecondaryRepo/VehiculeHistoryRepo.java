package com.transtu.transtu.SecondaryRepo;

import com.transtu.transtu.Document.GPS;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface VehiculeHistoryRepo extends MongoRepository<GPS,String> {
List<GPS> findByMatriculeOrderByRunningtimeDesc(String vehiculeid);
}
