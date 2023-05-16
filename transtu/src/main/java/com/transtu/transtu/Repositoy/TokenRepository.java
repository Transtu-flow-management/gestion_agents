package com.transtu.transtu.Repositoy;

import com.transtu.transtu.Document.Token;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;
import java.util.Optional;

public interface TokenRepository extends MongoRepository<Token,Integer> {
    @Query(value = "{ 'test.id': ?0, $or: [ { expired: false }, { revoked: false } ] }")
    List<Token> findByAgentIdAndExpiredOrRevokedFalse(Integer id);
    Optional<Token> findByToken(String token);

}
