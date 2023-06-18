package com.transtu.transtu.Repositoy;

import com.transtu.transtu.DTO.AgentDTO;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AgentPageRepo extends MongoRepository<AgentDTO,Integer> {
}
