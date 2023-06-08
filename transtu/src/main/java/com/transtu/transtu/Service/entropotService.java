package com.transtu.transtu.Service;

import com.transtu.transtu.Controller.DepotController;
import com.transtu.transtu.Document.Depots;
import com.transtu.transtu.Repositoy.ReseauRepo;
import com.transtu.transtu.Repositoy.entropotRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class entropotService {
@Autowired
    private entropotRepo entropotrepo;
@Autowired
    private ReseauRepo reseauRepo;
public List<Depots>getAllDepots(){
    return entropotrepo.findAll();
}
public EntityModel<Depots>createDepot(Depots depots){
    if(entropotrepo.existsByName(depots.getName())){
        throw new IllegalArgumentException("le nom de l\'entropôt deja existant");
    }
    Depots savedDepots = entropotrepo.save(depots);
    depots.setDateOfInsertion(new Date());
    WebMvcLinkBuilder selflink = WebMvcLinkBuilder.linkTo(DepotController.class).slash(savedDepots.getId());
    EntityModel<Depots> depotsEntityModel = EntityModel.of(savedDepots);
    depotsEntityModel.add(selflink.withSelfRel());
    return depotsEntityModel;

}
    public void Deleteall(){
        entropotrepo.deleteAll();
    }
    public List<Depots> GetAllDepots(){
   return entropotrepo.findAll();
    }
}
