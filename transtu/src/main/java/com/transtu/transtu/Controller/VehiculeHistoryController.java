package com.transtu.transtu.Controller;

import com.transtu.transtu.Document.GPS;
import com.transtu.transtu.SecondaryRepo.CollectionNameHolder;
import com.transtu.transtu.SecondaryRepo.VehiculeHistoryRepo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(originPatterns = "*")
@RequestMapping("/api/history")
public class VehiculeHistoryController {
    @Autowired
    private MongoTemplate mongoTemplate;
    @Autowired
    private VehiculeHistoryRepo vehiculeHistoryRepo;
    private static final Logger logger = LoggerFactory.getLogger(VehiculeHistoryController.class);

    //@GetMapping("/{collectionName}")
    public List<GPS> getAllGPSDataForMatricule(@PathVariable
                                                   String collectionName) {
        try {
            logger.info("Querying collection: {}", collectionName);
            List<GPS> gpsDataList = mongoTemplate.findAll(GPS.class, collectionName);
            logger.info("Found {} documents in collection: {}", gpsDataList.size(), collectionName);
            return gpsDataList;
        } catch (Exception e) {
            logger.error("Error querying collection: {}", collectionName, e);
            throw e; // Rethrow the exception for error handling
        }
    }
    @PostMapping
    public ResponseEntity<GPS>createGPS(@RequestBody GPS gps){
        String collectionName = "vehicule_" + gps.getMatricule();
        CollectionNameHolder.set(collectionName);
       GPS gpsdata = vehiculeHistoryRepo.save(gps);

        return ResponseEntity.ok(gpsdata);
    }
    @GetMapping("/{prefix}")
    public long getDocumentCount(@PathVariable String prefix) {
        String collectionName = "vehicule_" + prefix;
        CollectionNameHolder.set(collectionName);
        Query query = new Query();
        long count = mongoTemplate.count(query, GPS.class, collectionName);
        return count;
    }
}