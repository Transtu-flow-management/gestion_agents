package com.transtu.transtu.Controller;

import com.transtu.transtu.Document.Marque;
import com.transtu.transtu.Document.Reseaux;
import com.transtu.transtu.Document.fabriquant;
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
    private ResponseEntity<EntityModel<Marque>> addDepot(@RequestBody Marque marque){

        EntityModel<Marque> createdbrand = brandService.createMarque(marque);
        return ResponseEntity.created(createdbrand.getRequiredLink(IanaLinkRelations.SELF).toUri()).body(createdbrand);
    }
    @DeleteMapping
    private ResponseEntity<?>DeleteAll(){
        brandService.Deleteall();
        return ResponseEntity.status(HttpStatus.GONE).build();
    }
    @GetMapping
    private ResponseEntity<List<Marque>> getAll(){
        List<Marque> marques = brandService.getAllbrands();
        return ResponseEntity.ok(marques);
    }
    @PutMapping("/update/{id}")
    private ResponseEntity<Marque> updatebrand(@PathVariable String id,@RequestBody Marque marque){
        Marque updated = brandService.updatebrand(id,marque);
        return ResponseEntity.ok(updated);
    }
    @GetMapping("/{id}")
    private ResponseEntity<Marque> getcurrent(@PathVariable String id){
        Marque currentDepot = brandService.getCurrent(id);
        return ResponseEntity.ok(currentDepot);
    }
    @DeleteMapping("/{id}")
    private ResponseEntity<Marque> deletebrand(@PathVariable String id){
        return brandService.deleteMarque(id);
    }

    @GetMapping("/fabriquants")
    private ResponseEntity<List<fabriquant>> getAllfab(){
        List<fabriquant> fabriquants = brandService.getallfabriquants();
        return ResponseEntity.ok(fabriquants);
    }
}
