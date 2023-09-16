package com.transtu.transtu.Repositoy;
import com.transtu.transtu.DTO.AgentDTO;
import com.transtu.transtu.Document.Agent;
import com.transtu.transtu.Document.Line;
import com.transtu.transtu.Document.Role;
import com.transtu.transtu.Document.Warehouse;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface AgentRepo extends MongoRepository<Agent, Integer> {

    Agent findByUsername(String username);
    boolean existsByUsername(String username);
    List<Agent> findByRole(Role role);
    List<Agent> findBydateOfInsertionBetween(Date start, Date end);
    Warehouse findByWarehouse(Warehouse warehouse);



}
