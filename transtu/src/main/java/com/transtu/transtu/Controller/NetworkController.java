package com.transtu.transtu.Controller;

import com.transtu.transtu.Document.Reseau;
import com.transtu.transtu.Document.Networks;
import com.transtu.transtu.Repositoy.ReseauRepo;
import com.transtu.transtu.Service.ReseauService;
import com.transtu.transtu.Service.SequenceGeneratorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.IanaLinkRelations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

import static com.transtu.transtu.Document.Reseau.SEQUENCE_NAME_RES;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/resx")
public class NetworkController {
    @Autowired
    SequenceGeneratorService mongogen;
    @Autowired
    private ReseauRepo reseauRepo;
    @Autowired
    private ReseauService reseauService;

    @PostMapping("/create")
    private ResponseEntity<EntityModel<Reseau>> addResx(@RequestBody Reseau reseau){
        if(!reseauRepo.existsByName(reseau.getName())){
            reseau.setId(mongogen.generateSequence(SEQUENCE_NAME_RES));}
        EntityModel<Reseau> createdResx = reseauService.createReseau(reseau);
        return ResponseEntity.created(createdResx.getRequiredLink(IanaLinkRelations.SELF).toUri()).body(createdResx);
    }
    @DeleteMapping
    private ResponseEntity<?>DeleteAll(){
        reseauService.Deleteall();
        mongogen.resetSequence(SEQUENCE_NAME_RES);
        return ResponseEntity.status(HttpStatus.GONE).build();
    }
    @GetMapping
    public ResponseEntity<List<Networks>> getAllResx() {
        List<Networks> resxlist = new ArrayList<>();
        for (Networks resx : Networks.values()) {
            resxlist.add(resx);
        }
        return ResponseEntity.ok(resxlist);
    }
    @PutMapping("/update/{id}")
    private ResponseEntity<Reseau> updateresx(@PathVariable Integer id,@RequestBody Reseau reseau){
        Reseau updated = reseauService.updateReseau(id,reseau);
        return ResponseEntity.ok(updated);
    }
    @GetMapping("/{id}")
    private ResponseEntity<Reseau> getcurrent(@PathVariable Integer id){
        Reseau currentresx = reseauService.getCurrent(id);
        return ResponseEntity.ok(currentresx);
    }
    @DeleteMapping("/{id}")
    private ResponseEntity<?> deleteResx(@PathVariable Integer id){
        Optional<Reseau> removedresx = reseauRepo.findById(id);
        if (removedresx.isEmpty()){
            return ResponseEntity.notFound().build();
        }
        reseauRepo.deleteById(id);
        return ResponseEntity.status(HttpStatus.ACCEPTED).build();
    }
}