package com.transtu.transtu.Repositoy;

import com.transtu.transtu.DTO.AgentDTO;
import com.transtu.transtu.Document.Conductor;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Date;
import java.util.List;

public interface AgentPageRepo extends MongoRepository<AgentDTO,Integer> {

}
