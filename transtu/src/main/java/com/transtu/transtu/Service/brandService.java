package com.transtu.transtu.Service;

import com.transtu.transtu.Controller.brandController;
import com.transtu.transtu.Document.Brand;
import com.transtu.transtu.Document.CarBuilder;
import com.transtu.transtu.Handlers.NotFoundHandler;
import com.transtu.transtu.Repositoy.BrandRepo;
import com.transtu.transtu.Repositoy.makerRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class brandService {
@Autowired
   private BrandRepo brandRepo;
@Autowired
private makerRepo fabriquantRepo;
    public List<Brand> getAllbrands(){
        return brandRepo.findAll();
    }
    public List<CarBuilder> getallfabriquants(){
        return fabriquantRepo.findAll();
    }
    public EntityModel<Brand> createMarque(Brand brand) {

        if (brandRepo.existsByName(brand.getName())) {
            throw new IllegalArgumentException("le nom de l'entrepôt déjà existant");
        }

        CarBuilder existingCarBuilder = fabriquantRepo.findByName(brand.getMaker());
        if (existingCarBuilder != null) {
            brand.setMaker(existingCarBuilder.getName());
        } else {
            CarBuilder CarBuilder = new CarBuilder();
            CarBuilder.setName(brand.getMaker());
            CarBuilder = fabriquantRepo.save(CarBuilder);
            brand.setMaker(CarBuilder.getName());
        }

        brand.setDateOfInsertion(new Date());
        Brand savedBrand = brandRepo.save(brand);

        WebMvcLinkBuilder selfLink = WebMvcLinkBuilder.linkTo(brandController.class).slash(savedBrand.getId());
        EntityModel<Brand> marqueEntityModel = EntityModel.of(savedBrand);
        marqueEntityModel.add(selfLink.withSelfRel());
        return marqueEntityModel;
    }

    public void Deleteall(){
        brandRepo.deleteAll();
    }
    public Brand updatebrand(String id, Brand brand) {
        Brand newbrand = brandRepo.findById(id).orElseThrow(() -> new NotFoundHandler(id));

        if (!brand.getMaker().equals(newbrand.getMaker())) {
            if (brand.getMaker() != null && !brand.getMaker().isEmpty()) {
                CarBuilder existingCarBuilder = fabriquantRepo.findByName(brand.getMaker());
                if (existingCarBuilder != null) {
                    newbrand.setMaker(brand.getMaker());
                } else {
                    CarBuilder CarBuilder = new CarBuilder();
                    CarBuilder.setName(brand.getMaker());
                    CarBuilder = fabriquantRepo.save(CarBuilder);
                    newbrand.setMaker(CarBuilder.getName());
                }
            }
        }
        newbrand.setName(brand.getName());
        newbrand.setDateOfModification(new Date());
        return brandRepo.save(newbrand);
    }



    public ResponseEntity<Brand> deleteMarque(String id){
        Optional<Brand> removedbrand = brandRepo.findById(id);
        if (removedbrand.isEmpty()){
            return ResponseEntity.notFound().build();
        }
        brandRepo.deleteById(id);
        return ResponseEntity.status(HttpStatus.ACCEPTED).build();
    }

    public Brand getCurrent(String id){
        return brandRepo.findById(id).orElseThrow(()->new NotFoundHandler(id));
    }

}
