package com.transtu.transtu.Service;

import com.transtu.transtu.Document.Condition;
import com.transtu.transtu.Handlers.NotFoundHandler;
import com.transtu.transtu.Repositoy.ConditionRepo;
import org.apache.commons.logging.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class ConditionService {
    @Autowired private ConditionRepo conditionRepo;
    @Cacheable(value = "cachedConditions" ,key = "'conditions'")
    public Page<Condition> getAll(Pageable p){
        System.out.println("getting condtions from db");
        return conditionRepo.findAll(p);
    }

    public List<Condition> getAllc(){

        return conditionRepo.findAll();
    }
    @CacheEvict(key = "#condition.id",value = "cachedConditions")
    public Condition addCondition(Condition condition){
        if (conditionRepo.existsByName(condition.getName())){
            throw new IllegalArgumentException("condition exists");
        }
        condition.setDateOfInsertion(new Date());
        Condition saved = conditionRepo.save(condition);
        return saved;
    }
    @CachePut(key = "#id",value = "cachedConditions")
    public Condition updateCondition (String id,Condition condition){
        Condition newCondition = conditionRepo.findById(id).orElseThrow(()->new NotFoundHandler(id));
        newCondition.setName(condition.getName());
        newCondition.setTracking(condition.getTracking());
        newCondition.setVisibility(condition.getVisibility());
        newCondition.setDateOfModification(new Date());
        return conditionRepo.save(newCondition);
    }
    public void DeleteAll(){conditionRepo.deleteAll();}
    @CacheEvict(key = "#id",value = "cachedConditions")
    public void deleteByCondId(String id){
        Optional<Condition> optionalCondition = conditionRepo.findById(id);
        if (optionalCondition.isPresent()){
            conditionRepo.deleteById(id);
        }else {
            throw new NotFoundHandler(id);
        }
    }

}
