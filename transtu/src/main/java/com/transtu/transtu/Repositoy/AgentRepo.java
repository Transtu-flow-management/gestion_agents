package com.transtu.transtu.Repositoy;

import com.transtu.transtu.DTO.AgentDTO;
import com.transtu.transtu.Document.Agent;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AgentRepo extends MongoRepository<Agent, Integer> {
    Agent findByemail(String email);
    Agent findByUsername(String username);
    boolean existsByUsername(String username);
    boolean existsByemail(String email);
    List<AgentDTO> findByNameIgnoreCaseContaining(String name);
    Page<AgentDTO> findByNameContaining(String name, Pageable pageable);

}
