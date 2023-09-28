package com.transtu.transtu.Service;

import com.transtu.transtu.Controller.brandController;
import com.transtu.transtu.Document.Brand;
import com.transtu.transtu.Document.CarBuilder;
import com.transtu.transtu.Handlers.NotFoundHandler;
import com.transtu.transtu.Repositoy.BrandRepo;
import com.transtu.transtu.Repositoy.makerRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
private makerRepo builderRepo;
    public Page<Brand> getAllbrands(Pageable pageable){
        return brandRepo.findAll(pageable);
    }
    public List<CarBuilder> getallfabriquants(){
        return builderRepo.findAll();
    }
    public EntityModel<Brand> createMarque(Brand brand) {

        if (brandRepo.existsByName(brand.getName())) {
            throw new IllegalArgumentException("le nom de l'entrepôt déjà existant");
        }
        String namebuilder = brand.getBuilder();
        if (!namebuilder.equals(null)) {
            CarBuilder existingCarBuilder = builderRepo.findByName(brand.getBuilder());
            if (existingCarBuilder != null) {
                brand.setBuilder(existingCarBuilder.getName());
            } else {
                CarBuilder CarBuilder = new CarBuilder();
                CarBuilder.setName(brand.getBuilder());
                CarBuilder = builderRepo.save(CarBuilder);
                brand.setBuilder(CarBuilder.getName());
            }
        }else
        {
            throw new IllegalArgumentException("builderName cannot be null");
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
    public void Deleteallmakers(){
        builderRepo.deleteAll();}
    public Brand updatebrand(String id, Brand brand) {
        Brand newbrand = brandRepo.findById(id).orElseThrow(() -> new NotFoundHandler(id));

        if (!brand.getBuilder().equals(newbrand.getBuilder())) {
            if (brand.getBuilder() != null && !brand.getBuilder().isEmpty()) {
                CarBuilder existingCarBuilder = builderRepo.findByName(brand.getBuilder());
                if (existingCarBuilder != null) {
                    newbrand.setBuilder(brand.getBuilder());
                } else {
                    CarBuilder CarBuilder = new CarBuilder();
                    CarBuilder.setName(brand.getBuilder());
                    CarBuilder = builderRepo.save(CarBuilder);
                    newbrand.setBuilder(CarBuilder.getName());
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
