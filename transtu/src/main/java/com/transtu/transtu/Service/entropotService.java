package com.transtu.transtu.Service;

import com.transtu.transtu.Controller.WarehouseController;
import com.transtu.transtu.Document.Warehouse;
import com.transtu.transtu.Document.Networks;
import com.transtu.transtu.Handlers.NotFoundExcemptionhandler;
import com.transtu.transtu.Repositoy.entropotRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class entropotService {
@Autowired
    private entropotRepo entropotrepo;

public List<Warehouse>getAllDepots(){
    return entropotrepo.findAll();
}
public EntityModel<Warehouse>createDepot(Warehouse warehouse){
    if(entropotrepo.existsByName(warehouse.getName())){
        throw new IllegalArgumentException("le nom de l\'entropôt deja existant");
    }
    warehouse.setDateOfInsertion(new Date());
    Warehouse savedWarehouse = entropotrepo.save(warehouse);

    WebMvcLinkBuilder selflink = WebMvcLinkBuilder.linkTo(WarehouseController.class).slash(savedWarehouse.getId());
    EntityModel<Warehouse> depotsEntityModel = EntityModel.of(savedWarehouse);
    depotsEntityModel.add(selflink.withSelfRel());
    return depotsEntityModel;

}
    public void Deleteall(){
        entropotrepo.deleteAll();
    }
    public List<Warehouse> GetAllDepots(){
   return entropotrepo.findAll();
    }
    public Warehouse updateDepot(Integer id, Warehouse warehouse){
    Warehouse newdepot = entropotrepo.findById(id).orElseThrow(()-> new NotFoundExcemptionhandler(id));
    newdepot.setName(warehouse.getName());
    newdepot.setCapacite(warehouse.getCapacite());
    newdepot.setSelectedReseau(warehouse.getSelectedReseau());
    newdepot.setAdresse(warehouse.getAdresse());
    newdepot.setDescription(warehouse.getDescription());
    newdepot.setLattitude(warehouse.getLattitude());
    newdepot.setLongitude(warehouse.getLongitude());
    newdepot.setDateOfModification(new Date());
    return entropotrepo.save(newdepot);

    }
    public Warehouse assignRestoDep(Integer depid, Networks networks){
        Warehouse warehouse = entropotrepo.findById(depid).orElseThrow(()-> new NotFoundExcemptionhandler(depid));

               warehouse.setSelectedReseau(networks.name());
            entropotrepo.save(warehouse);
        return warehouse;
    }
    public Warehouse getCurrent(Integer id){
       return entropotrepo.findById(id).orElseThrow(()->new NotFoundExcemptionhandler(id));
    }

}
