package com.transtu.transtu.Repositoy;

import com.transtu.transtu.Document.Condition;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ConditionRepo extends MongoRepository<Condition,String> {
    boolean existsByName(String name);
    Optional<Condition> findByName(String name);
}
