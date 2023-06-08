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

}
