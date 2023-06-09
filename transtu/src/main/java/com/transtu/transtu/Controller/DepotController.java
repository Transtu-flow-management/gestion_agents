package com.transtu.transtu.Controller;

import com.transtu.transtu.Document.Depots;
import com.transtu.transtu.Repositoy.entropotRepo;
import com.transtu.transtu.Service.SequenceGeneratorService;
import com.transtu.transtu.Service.entropotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.IanaLinkRelations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

import static com.transtu.transtu.Document.Depots.SEQUENCE_NAME_Depot;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/depot")
public class DepotController {
    @Autowired
   private entropotService entropotService;
    @Autowired
    SequenceGeneratorService mongogen;
    @Autowired
    private com.transtu.transtu.Repositoy.entropotRepo entropotRepo;

    @PostMapping("/create")
    private ResponseEntity<EntityModel<Depots>> addDepot(@RequestBody Depots depots){
    if(!entropotRepo.existsByName(depots.getName())){
    depots.setId(mongogen.generateSequence(SEQUENCE_NAME_Depot));}
    EntityModel<Depots> createdDepot = entropotService.createDepot(depots);
    return ResponseEntity.created(createdDepot.getRequiredLink(IanaLinkRelations.SELF).toUri()).body(createdDepot);
}
@DeleteMapping
    private ResponseEntity<?>DeleteAll(){
    entropotService.Deleteall();
    mongogen.resetSequence(SEQUENCE_NAME_Depot);
    return ResponseEntity.status(HttpStatus.GONE).build();
}
@GetMapping
    private ResponseEntity<List<Depots>> getAll(){
        List<Depots> depots = entropotService.getAllDepots();
        return ResponseEntity.ok(depots);
    }
    @PatchMapping("/update/{id}")
    private ResponseEntity<Depots> updateDepot(@PathVariable Integer id,@RequestBody Depots depots){
        Depots updated = entropotService.updateDepot(id,depots);
        return ResponseEntity.ok(updated);
    }
@GetMapping("/{id}")
    private ResponseEntity<Depots> getcurrent(@PathVariable Integer id){
    Depots currentDepot = entropotService.getCurrent(id);
    return ResponseEntity.ok(currentDepot);
}
@DeleteMapping("/{id}")
    private ResponseEntity<Depots> deleteDepot(@PathVariable Integer id){
        Optional<Depots> removedDepo = entropotRepo.findById(id);
        if (removedDepo.isEmpty()){
            return ResponseEntity.notFound().build();
        }
        entropotRepo.deleteById(id);
        return ResponseEntity.status(HttpStatus.ACCEPTED).build();
    }

}
