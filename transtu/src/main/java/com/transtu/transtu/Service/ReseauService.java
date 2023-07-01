package com.transtu.transtu.Service;

import com.transtu.transtu.Controller.NetworkController;
import com.transtu.transtu.Document.Reseau;
import com.transtu.transtu.Handlers.NotFoundExcemptionhandler;
import com.transtu.transtu.Repositoy.ReseauRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class ReseauService {
    @Autowired
    private ReseauRepo resxrepo;
    public List<Reseau> getAllResx(){
        return resxrepo.findAll();
    }
    public EntityModel<Reseau> createReseau(Reseau reseau){
        if(resxrepo.existsByName(reseau.getName())){
            throw new IllegalArgumentException("le nom de reseau deja existant");
        }
        Reseau savedDepots = resxrepo.save(reseau);
        reseau.setDateOfInsertion(new Date());
        WebMvcLinkBuilder selflink = WebMvcLinkBuilder.linkTo(NetworkController.class).slash(savedDepots.getId());
        EntityModel<Reseau> depotsEntityModel = EntityModel.of(savedDepots);
        depotsEntityModel.add(selflink.withSelfRel());
        return depotsEntityModel;

    }
    public void Deleteall(){
        resxrepo.deleteAll();
    }
    public List<Reseau> GetAllDepots(){
        return resxrepo.findAll();
    }
    public Reseau updateReseau(Integer id,Reseau reseau){
        Reseau newres = resxrepo.findById(id).orElseThrow(()-> new NotFoundExcemptionhandler(id));
        newres.setName(reseau.getName());
        newres.setDateOfModification(new Date());
        return resxrepo.save(newres);

    }
    public Reseau getCurrent(Integer id){
        return resxrepo.findById(id).orElseThrow(()->new NotFoundExcemptionhandler(id));
    }

}
