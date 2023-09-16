package com.transtu.transtu.Repositoy;

import com.transtu.transtu.Document.Reclammation;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ReclamRepo extends MongoRepository<Reclammation,String> {
}
