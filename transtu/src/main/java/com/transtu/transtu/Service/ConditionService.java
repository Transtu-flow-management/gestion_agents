package com.transtu.transtu.Service;

import com.transtu.transtu.Document.Condition;
import com.transtu.transtu.Handlers.NotFoundHandler;
import com.transtu.transtu.Repositoy.ConditionRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Optional;

@Service
public class ConditionService {
    @Autowired private ConditionRepo conditionRepo;
    public Page<Condition> getAll(Pageable p){
        return conditionRepo.findAll(p);
    }
    public Condition addCondition(Condition condition){
        if (conditionRepo.existsByName(condition.getName())){
            throw new IllegalArgumentException("condition exists");
        }
        condition.setDateOfInsertion(new Date());
        Condition saved = conditionRepo.save(condition);
        return saved;
    }
    public Condition updateCondition (String id,Condition condition){
        Condition newCondition = conditionRepo.findById(id).orElseThrow(()->new NotFoundHandler(id));
        newCondition.setName(condition.getName());
        newCondition.setTracking(condition.getTracking());
        newCondition.setVisibility(condition.getVisibility());
        newCondition.setDateOfModification(new Date());
        return conditionRepo.save(newCondition);
    }
    public void DeleteAll(){conditionRepo.deleteAll();}
    public void deleteByCondId(String id){
        Optional<Condition> optionalCondition = conditionRepo.findById(id);
        if (optionalCondition.isPresent()){
            conditionRepo.deleteById(id);
        }else {
            throw new NotFoundHandler(id);
        }
    }

}
