package com.transtu.transtu.Repositoy;

import com.transtu.transtu.Document.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepo extends MongoRepository<Role,Integer> {
    Boolean existsByRoleName(String RoleName);


}
