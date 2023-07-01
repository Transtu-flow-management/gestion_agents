package com.transtu.transtu.Service;
import com.transtu.transtu.Controller.ConductorController;
import com.transtu.transtu.Document.Conductor;
import com.transtu.transtu.Handlers.NotFoundExcemptionhandler;
import com.transtu.transtu.Repositoy.ConductorRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.stereotype.Service;

import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import static com.transtu.transtu.Document.Conductor.SEQUENCE_Cond_NAME;

@Service
@RequiredArgsConstructor
public class ConductorService {
    @Autowired
    ConductorRepo conductorRepo;
    @Autowired
    private final SequenceGeneratorService mongo;
    public EntityModel<Conductor> create(Conductor conductor){
        String uniqueId = conductor.getUid();
        if (conductorRepo.existsByuid(uniqueId)){
            throw new IllegalArgumentException("uniqueId exists");
        }else {
        Integer cond_id = mongo.generateSequence(SEQUENCE_Cond_NAME);
        conductor.setId(cond_id);
        conductor.setDateOfInsertion(new Date());
        Conductor newConductor = conductorRepo.save(conductor);

        WebMvcLinkBuilder selfLink = WebMvcLinkBuilder.linkTo(ConductorController.class).slash(newConductor.getId());
        EntityModel<Conductor> ConductorEntityModel = EntityModel.of(newConductor);
        ConductorEntityModel.add(selfLink.withSelfRel());
        return ConductorEntityModel;}
    }

    public Page<Conductor> getAllConductors(Pageable pageable){
       return conductorRepo.findAll(pageable);
    }
    public List<Conductor> getAllConductorsWithDateFilter(Date date) {
        Calendar startOfDay = Calendar.getInstance();
        startOfDay.setTime(date);
        startOfDay.set(Calendar.HOUR_OF_DAY, 0);
        startOfDay.set(Calendar.MINUTE, 0);
        startOfDay.set(Calendar.SECOND, 0);

        Calendar endOfDay = Calendar.getInstance();
        endOfDay.setTime(date);
        endOfDay.set(Calendar.HOUR_OF_DAY, 23);
        endOfDay.set(Calendar.MINUTE, 59);
        endOfDay.set(Calendar.SECOND, 59);
        return conductorRepo.findBydateOfInsertionBetween(startOfDay.getTime(), endOfDay.getTime());
    }
    public Conductor updateConductor(Integer id,Conductor conductor){
        Conductor newConductor = conductorRepo.findById(id).orElseThrow(()-> new NotFoundExcemptionhandler(id));
        newConductor.setName(conductor.getName());
        newConductor.setUid(conductor.getUid());
        newConductor.setDateOfModification(new Date());
        return conductorRepo.save(newConductor);
    }
    public void deleteAll(){
        conductorRepo.deleteAll();
    }
    public void deleteByCondId(Integer id){
        Optional<Conductor> optionalConductor = conductorRepo.findById(id);
        if (optionalConductor.isPresent()){
            conductorRepo.deleteById(id);
        }else {
            throw new NotFoundExcemptionhandler(id);
        }
    }
}
