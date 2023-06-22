package com.transtu.transtu.Service;

import com.transtu.transtu.Controller.DepotController;
import com.transtu.transtu.Controller.brandController;
import com.transtu.transtu.Document.Depots;
import com.transtu.transtu.Document.Marque;
import com.transtu.transtu.Document.Reseaux;
import com.transtu.transtu.Document.fabriquant;
import com.transtu.transtu.Handlers.NotFoundExcemptionhandler;
import com.transtu.transtu.Handlers.NotFoundHandler;
import com.transtu.transtu.Repositoy.BrandRepo;
import com.transtu.transtu.Repositoy.fabriquantRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class brandService {
@Autowired
   private BrandRepo brandRepo;
@Autowired
private fabriquantRepo fabriquantRepo;
    public List<Marque> getAllbrands(){
        return brandRepo.findAll();
    }
    public List<fabriquant> getallfabriquants(){
        return fabriquantRepo.findAll();
    }
    public EntityModel<Marque> createMarque(Marque marque) {

        if (brandRepo.existsByName(marque.getName())) {
            throw new IllegalArgumentException("le nom de l'entrepôt déjà existant");
        }

        fabriquant existingFabriquant = fabriquantRepo.findByName(marque.getFabriquant());
        if (existingFabriquant != null) {
            marque.setFabriquant(existingFabriquant.getName());
        } else {
            fabriquant fabriquant = new fabriquant();
            fabriquant.setName(marque.getFabriquant());
            fabriquant = fabriquantRepo.save(fabriquant);
            marque.setFabriquant(fabriquant.getName());
        }

        marque.setDateOfInsertion(new Date());
        Marque savedMarque = brandRepo.save(marque);

        WebMvcLinkBuilder selfLink = WebMvcLinkBuilder.linkTo(brandController.class).slash(savedMarque.getId());
        EntityModel<Marque> marqueEntityModel = EntityModel.of(savedMarque);
        marqueEntityModel.add(selfLink.withSelfRel());
        return marqueEntityModel;
    }

    public void Deleteall(){
        brandRepo.deleteAll();
    }
    public Marque updatebrand(String id, Marque marque) {
        Marque newbrand = brandRepo.findById(id).orElseThrow(() -> new NotFoundHandler(id));

        if (!marque.getFabriquant().equals(newbrand.getFabriquant())) {
            if (marque.getFabriquant() != null && !marque.getFabriquant().isEmpty()) {
                fabriquant existingFabriquant = fabriquantRepo.findByName(marque.getFabriquant());
                if (existingFabriquant != null) {
                    newbrand.setFabriquant(marque.getFabriquant());
                } else {
                    fabriquant fabriquant = new fabriquant();
                    fabriquant.setName(marque.getFabriquant());
                    fabriquant = fabriquantRepo.save(fabriquant);
                    newbrand.setFabriquant(fabriquant.getName());
                }
            }
        }
        newbrand.setName(marque.getName());
        newbrand.setDateOfModification(new Date());
        return brandRepo.save(newbrand);
    }



    public ResponseEntity<Marque> deleteMarque(String id){
        Optional<Marque> removedbrand = brandRepo.findById(id);
        if (removedbrand.isEmpty()){
            return ResponseEntity.notFound().build();
        }
        brandRepo.deleteById(id);
        return ResponseEntity.status(HttpStatus.ACCEPTED).build();
    }

    public Marque getCurrent(String id){
        return brandRepo.findById(id).orElseThrow(()->new NotFoundHandler(id));
    }

}
