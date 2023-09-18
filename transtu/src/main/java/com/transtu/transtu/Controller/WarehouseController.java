package com.transtu.transtu.Controller;

import com.transtu.transtu.Document.Line;
import com.transtu.transtu.Document.Warehouse;
import com.transtu.transtu.Document.Networks;
import com.transtu.transtu.Repositoy.LineRepo;
import com.transtu.transtu.Service.SequenceGeneratorService;
import com.transtu.transtu.Service.entropotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.IanaLinkRelations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

import static com.transtu.transtu.Document.Warehouse.SEQUENCE_NAME_Depot;

@RestController
@CrossOrigin(originPatterns = "*")
@RequestMapping("/api/depot")
public class WarehouseController {
    @Autowired
   private entropotService entropotService;
    @Autowired
    SequenceGeneratorService mongogen;
    @Autowired
    private com.transtu.transtu.Repositoy.entropotRepo entropotRepo;
    @Autowired
    private LineRepo lineRepo;

    @PostMapping("/create")
   // @PreAuthorize("hasAuthority('writeDepot')")
    public ResponseEntity<EntityModel<Warehouse>> addDepot(@RequestBody Warehouse warehouse){
    if(!entropotRepo.existsByName(warehouse.getName())){
    warehouse.setId(mongogen.generateSequence(SEQUENCE_NAME_Depot));}
    EntityModel<Warehouse> createdDepot = entropotService.createDepot(warehouse);
    return ResponseEntity.created(createdDepot.getRequiredLink(IanaLinkRelations.SELF).toUri()).body(createdDepot);
}
@DeleteMapping
//@PreAuthorize("hasAuthority('deleteDepot')")
public ResponseEntity<?>DeleteAll(){
    entropotService.Deleteall();
    mongogen.resetSequence(SEQUENCE_NAME_Depot);
    return ResponseEntity.status(HttpStatus.GONE).build();
}
@GetMapping
//@PreAuthorize("hasAuthority('readDepot')")
public ResponseEntity<List<Warehouse>> getAll(){
        List<Warehouse> depots = entropotService.getAllDepots();
        return ResponseEntity.ok(depots);
    }
    @PutMapping("/update/{id}")
   // @PreAuthorize("hasAuthority('updateDepot')")
    public ResponseEntity<Warehouse> updateDepot(@PathVariable Integer id, @RequestBody Warehouse warehouse){
        Warehouse updated = entropotService.updateDepot(id, warehouse);
        return ResponseEntity.ok(updated);
    }
@GetMapping("/{id}")
//@PreAuthorize("hasAuthority('readDepot')")
public ResponseEntity<Warehouse> getcurrent(@PathVariable Integer id){
    Warehouse currentDepot = entropotService.getCurrent(id);
    return ResponseEntity.ok(currentDepot);
}
@DeleteMapping("/{id}")
//@PreAuthorize("hasAuthority('deleteDepot')")
public ResponseEntity<Warehouse> deleteDepot(@PathVariable Integer id,@RequestParam(required = false) boolean confirmDelete){
        Optional<Warehouse> removedDepo = entropotRepo.findById(id);
        if (removedDepo.isEmpty()){
            return ResponseEntity.notFound().build();
        }
        Warehouse warehouse = removedDepo.get();
    List<Line> associatedLines = lineRepo.findByWarehouse(warehouse);
    if(!associatedLines.isEmpty() && !confirmDelete){
        return ResponseEntity.status(HttpStatus.CONFLICT).build();
    }
        entropotRepo.deleteById(id);
        return ResponseEntity.status(HttpStatus.ACCEPTED).build();
    }
    @PostMapping("/{depid}/assignRes")
   // @PreAuthorize("hasAuthority('writeDepot')")
    public ResponseEntity<?> assignRestoDepot(@PathVariable Integer depid, @RequestBody Networks networks){
        entropotService.assignRestoDep(depid, networks);
        return ResponseEntity.ok(HttpStatus.OK);
    }

}
