package com.transtu.transtu.Repositoy;

import com.transtu.transtu.Document.Agent;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AgentRepo extends MongoRepository<Agent, Integer> {
    String findByUsername(String username);
    boolean existsByUsername(String username);
}
