package com.transtu.transtu.Service;

import com.mongodb.BasicDBObject;
import com.transtu.transtu.Document.Sequence;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import static org.springframework.data.mongodb.core.FindAndModifyOptions.options;
import static org.springframework.data.mongodb.core.query.Criteria.where;
import static org.springframework.data.mongodb.core.query.Query.query;

@Service
public class SequenceGeneratorService {
    @Autowired
    private MongoOperations mongoTemplate;
    public int generateSequence(String sequenceName){

        Sequence counter = mongoTemplate.findAndModify(
                query(where("_id").is(sequenceName)),
                new Update().inc("sequanceValue",1),
                options().returnNew(true).upsert(true),
                Sequence.class);
        if (counter == null) {
            counter = new Sequence();
            counter.setId(sequenceName);
            counter.setSequanceValue(1);
            mongoTemplate.save(counter);}
        return counter.getSequanceValue();
    }

    public void resetSequence(String sequenceName) {
        Query query = new Query(Criteria.where("_id").is(sequenceName));
        mongoTemplate.remove(query, Sequence.class);

        Sequence sequence = new Sequence();
        sequence.setId(sequenceName);
        sequence.setSequanceValue(0);
        mongoTemplate.save(sequence);
    }


}
