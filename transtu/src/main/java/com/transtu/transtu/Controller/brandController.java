package com.transtu.transtu.Controller;

import com.transtu.transtu.Document.Brand;
import com.transtu.transtu.Document.CarBuilder;
import com.transtu.transtu.Repositoy.BrandRepo;
import com.transtu.transtu.Service.brandService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.IanaLinkRelations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/brand")
public class brandController {

    @Autowired
    private brandService brandService;
    @Autowired
    private BrandRepo brandRepo;


    @PostMapping("/create")
    private ResponseEntity<EntityModel<Brand>> addDepot(@RequestBody Brand brand){

        EntityModel<Brand> createdbrand = brandService.createMarque(brand);
        return ResponseEntity.created(createdbrand.getRequiredLink(IanaLinkRelations.SELF).toUri()).body(createdbrand);
    }
    @DeleteMapping
    private ResponseEntity<?>DeleteAll(){
        brandService.Deleteall();
        return ResponseEntity.status(HttpStatus.GONE).build();
    }
    @GetMapping
    private ResponseEntity<List<Brand>> getAll(){
        List<Brand> brands = brandService.getAllbrands();
        return ResponseEntity.ok(brands);
    }
    @PutMapping("/update/{id}")
    private ResponseEntity<Brand> updatebrand(@PathVariable String id, @RequestBody Brand brand){
        Brand updated = brandService.updatebrand(id, brand);
        return ResponseEntity.ok(updated);
    }
    @GetMapping("/{id}")
    private ResponseEntity<Brand> getcurrent(@PathVariable String id){
        Brand currentbrand = brandService.getCurrent(id);
        return ResponseEntity.ok(currentbrand);
    }
    @DeleteMapping("/{id}")
    private ResponseEntity<Brand> deletebrand(@PathVariable String id){
        return brandService.deleteMarque(id);
    }

    @GetMapping("/fabriquants")
    private ResponseEntity<List<CarBuilder>> getAllfab(){
        List<CarBuilder> CarBuilders = brandService.getallfabriquants();
        return ResponseEntity.ok(CarBuilders);
    }
}
