package com.transtu.transtu.Repositoy;

import com.transtu.transtu.Document.Conductor;

import com.transtu.transtu.Document.Warehouse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface ConductorRepo extends MongoRepository<Conductor, Integer> {
    public boolean existsByuid (String uid);
    List<Conductor> findBydateOfInsertionBetween(Date start, Date end);
    Page<Conductor> findBywarehouseId(Integer id, Pageable pageable);
}
