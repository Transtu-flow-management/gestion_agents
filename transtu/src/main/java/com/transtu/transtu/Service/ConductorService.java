package com.transtu.transtu.Service;
import com.transtu.transtu.Controller.ConductorController;
import com.transtu.transtu.DTO.AgentDTO;
import com.transtu.transtu.Document.*;
import com.transtu.transtu.Handlers.NotFoundExcemptionhandler;
import com.transtu.transtu.Repositoy.AgentRepo;
import com.transtu.transtu.Repositoy.ConductorRepo;
import com.transtu.transtu.Repositoy.entropotRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.stereotype.Service;

import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import static com.transtu.transtu.Document.Conductor.SEQUENCE_Cond_NAME;

@Service
public class ConductorService {
   @Autowired
   private com.transtu.transtu.Repositoy.ConductorRepo conductorRepo;
    @Autowired
    private SequenceGeneratorService mongo;
    @Autowired
    private com.transtu.transtu.Repositoy.entropotRepo entropotRepo;
    @Autowired
    private AgentRepo agentRepo;

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

    public Page<Conductor> getAllConductors(Integer agentId, Pageable pageable) {
        Agent agent = agentRepo.findById(agentId).orElseThrow(()-> new NotFoundExcemptionhandler(agentId));
        boolean hasAllWarehousesPrivilege = hasAllWarehousesPrivilege(agent.getId());
        if (agent != null ) {
            if (agent.getWarehouse() != null){
            Integer warehouseId = agent.getWarehouse().getId();
                if (warehouseId !=null){
                    return conductorRepo.findBywarehouseId(warehouseId, pageable);}
            }
            if (hasAllWarehousesPrivilege){
                return conductorRepo.findAll(pageable);}

        }
        return Page.empty();
    }
    private Sort.Order currentOrder = Sort.Order.asc("name");
    public Page<Conductor> getAllConductorsSorted(Integer agentId, Pageable pageable) {
        Agent agent = agentRepo.findById(agentId).orElseThrow(()-> new NotFoundExcemptionhandler(agentId));
        currentOrder = (currentOrder.isAscending()) ? Sort.Order.desc("name") : Sort.Order.asc("name");
        Pageable sortedPageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(),  Sort.by(currentOrder));
        boolean hasAllWarehousesPrivilege = hasAllWarehousesPrivilege(agent.getId());
        if (agent != null ) {
            if (agent.getWarehouse() != null){
                Integer warehouseId = agent.getWarehouse().getId();
                if (warehouseId !=null){
                    return conductorRepo.findBywarehouseId(warehouseId, pageable);}
            }
            if (hasAllWarehousesPrivilege){
                return conductorRepo.findAll(sortedPageable);}

        }
        return Page.empty();
    }


    private boolean hasAllWarehousesPrivilege(Integer agentId) {
        Agent user = agentRepo.findById(agentId).orElseThrow(()-> new NotFoundExcemptionhandler(agentId));
            if (user!=null){
                Role userrole = user.getRole();
                if (userrole!=null &&userrole.getPermissions().contains(Permissions.DEFAULT_PERMISSION)){
                    return true;
                }
            }
            return false;
    }
    public List<Conductor> getall(){
        return conductorRepo.findAll();
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
        Conductor oldconductor = conductorRepo.findById(id).orElseThrow(()-> new NotFoundExcemptionhandler(id));
        oldconductor.setName(conductor.getName());
        oldconductor.setSurname(conductor.getSurname());
        oldconductor.setUid(conductor.getUid());
        oldconductor.setType(conductor.getType());
        Warehouse oldwarehouse = conductor.getWarehouse();
        if (oldwarehouse !=null){
            Optional<Warehouse> warehouseOptional = entropotRepo.findById(oldwarehouse.getId());
            oldconductor.setWarehouse(warehouseOptional.get());
        }
        oldconductor.setDateOfModification(new Date());
        return conductorRepo.save(oldconductor);
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
